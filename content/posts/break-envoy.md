---
title: "How to break the Envoy CI at head"
date: 2022-07-03T18:16:17-04:00
draft: false
---

I like to talk about small mistakes I've made. I'm a big proponent of
psychological safety, and as a champion for it, I think it's very important to
talk about times you've slipped up or done something dumb. We all make mistakes,
and there are times when you feel silly for doing something.

This is one of those times.

-----

[I recently merged a large pull request in Envoy that required a lot of work](/posts/my-longest-running-pr).
It was so satisfying to see the approvals come in, and that final moment where
the [PR](https://github.com/envoyproxy/envoy/pull/20281) finally merged was so
gratifying after many months, many delays, and many revisions.

It _was_, at least, until I got a few GitHub notifications:

> @AlexanderEllis we're reverting this because it broke CI on main. Can you
> figure out what broke and re-submit the PR with a fix? The easiest-to-review
> way to do that is to revert this revert, then add another commit with whatever
> fix needs to be made.

Ah, that satisfying feeling, quickly replaced by "oh shit I broke the build for
a big public project", the satisfaction vanishing into the afternoon breeze. Not
the end of the world, but I hate that feeling, especially as it meant other PRs
were blocked.

### The problem

Scoping out the error was illuminating, but mostly because I've been
desensitized to this sort of error message.

```none
...
[ RUN      ] GrpcAccessLoggerCacheImplTest.LoggerCreationResourceAttributes
unknown file: Failure
C++ exception with description "Protobuf message (type opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest reason INVALID_ARGUMENT:(resource_logs.instrumentation_library_logs[0]) logs: Cannot find field.) has unknown fields" thrown in the test body.
test/extensions/access_loggers/open_telemetry/grpc_access_log_impl_test.cc:51: Failure
Actual function call count doesn't match EXPECT_CALL(*async_client, startRaw(_, _, _, _))...
         Expected: to be called once
           Actual: never called - unsatisfied and active
Stack trace:
  0xf9f9ff: testing::internal::GoogleTestFailureReporter::ReportFailure()
  0xfa25ca: testing::internal::UntypedFunctionMockerBase::VerifyAndClearExpectationsLocked()
  0x6bab7e: testing::internal::FunctionMocker<>::~FunctionMocker()
  0x6bac9d: Envoy::Grpc::MockAsyncClient::~MockAsyncClient()
  0x6bacbe: Envoy::Grpc::MockAsyncClient::~MockAsyncClient()
  0x6b5961: Envoy::Extensions::AccessLoggers::Common::GrpcAccessLogger<>::~GrpcAccessLogger()
  0x6b6b81: Envoy::Extensions::AccessLoggers::Common::GrpcAccessLoggerCache<>::ThreadLocalCache::~ThreadLocalCache()
  0x90b59a: Envoy::ThreadLocal::MockInstance::SlotImpl::~SlotImpl()
  0x90b5fe: Envoy::ThreadLocal::MockInstance::SlotImpl::~SlotImpl()
  0x6b41aa: Envoy::Extensions::AccessLoggers::OpenTelemetry::(anonymous namespace)::GrpcAccessLoggerCacheImplTest::~GrpcAccessLoggerCacheImplTest()
  0x6b425e: Envoy::Extensions::AccessLoggers::OpenTelemetry::(anonymous namespace)::GrpcAccessLoggerCacheImplTest_LoggerCreationResourceAttributes_Test::~GrpcAccessLoggerCacheImplTest_LoggerCreationResourceAttributes_Test()
  0xfb49dc: testing::internal::HandleExceptionsInMethodIfSupported<>()
  0xfb5894: testing::TestInfo::Run()
  0xfb65e9: testing::TestSuite::Run()
... Google Test internal frames ...

```

This means that an exception was thrown because there was an unknown field,
the `log` field, in a `resource_logs.instrumentation_library_logs` proto.
Because that exception was thrown, this meant that the gmock
expectation on line 51 of the `async_client.startRaw` function being called was
_not_ being fulfilled, as the exception stopped everything immediately.

Much like the actual function call, I was also very unsatisfied.

This test in question,
`test/extensions/access_loggers/open_telemetry/grpc_access_log_impl_test.cc`,
was parsing YAML strings as protos to ensure the right fields were being
populated correctly, with something like the following:

```C++
const std::string expected_message_yaml = R"EOF(
  resource_logs:
    instrumentation_library_logs:
      - log:
          - severity_text: "test-severity-text"
  )EOF"
opentelemetry::proto::collector::logs::v1::ExportLogsServiceRequest expected_message;
TestUtility::loadFromYaml(expected_message_yaml, expected_message);
// ... more C++ goodness that verifies that the expected message is what shows up
```

The error above meant that it was running into trouble when parsing this YAML,
purportedly because the `log` field didn't exist.

### The diagnosis

This area of the code was actually only tangentially related to the changes I
was making. I was adding a new OpenTelemetry *tracing* extension, but this error
was in the OpenTelemetry *access logger*.  Although it was a separate extension
altogether, it immediately rang a bell as a suspicious character I had seen
before.

As part of the PR, I had bumped the version of the
[OpenTelemetry Proto library](https://github.com/open-telemetry/opentelemetry-proto)
that Envoy uses. One of the included changes in this bump was a breaking
change that renamed the `logs` field in
`resouce_logs.instrumentation_library_logs` to `log_records`.
I had bumped the version, and I had already done
[a little work to deal with the new field name](https://github.com/envoyproxy/envoy/pull/20281/commits/4057f4f54d8e8679cf779f87af4432aacbab5ada),
even though I was doing nothing related to logging.

Unfortunately for Envoy's CI, with hilariously bad timing, around 6 hours before
my multi-month PR was merged, a different PR had added a new test with the `log`
field in a YAML string that it parsed. I hadn't pulled that commit into my
branch, and when my PR was merged, this new test immediately started throwing
exceptions when it was being run, as this `log` field no longer existed with the
new version of the library.

Luckily, this meant that it was only
[a quick one line forward fix](https://github.com/envoyproxy/envoy/pull/21842/files)
to get things back in business.

### Happy little accidents

These silly mistakes are always helpful, if only for little reminders to
yourself down the line. For me, it's a good little reminder for a few things:

1. Be more careful about merging main (rookie mistake, and I blame myself for
   getting out of practice after 3.5 years of not using git for work)
2. Be careful about unstable library upgrades
3. Decouple library upgrades from other functional changes and avoid large PRs
4. As I mention in that other post, do everything you can to not have
   multi-month PRs!

<br>

May your builds be ever green and your tests be ever passing.