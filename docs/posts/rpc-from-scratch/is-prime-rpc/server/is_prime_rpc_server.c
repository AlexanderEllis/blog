// server/is_prime_rpc_server.c

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <sys/wait.h>
#include <signal.h>

#include "is_prime.h"

#define SERVERPORT "5005"  // The port the server will be listening on.

// Gets the IPv4 or IPv6 sockaddr.
void *get_in_addr(struct sockaddr *sa) {
  if (sa->sa_family == AF_INET) {
    return &(((struct sockaddr_in*)sa)->sin_addr);
  } else {
    return &(((struct sockaddr_in6*)sa)->sin6_addr);
  }
}

// Unpacks an int. We need to convert it from network order to our host order.
int unpack(int packed_input) {
  return ntohs(packed_input);
}

// Gets a socket to listen with.
int get_and_bind_socket() {
  int sockfd;
  struct addrinfo hints, *server_info, *p;
  int number_of_bytes;

  memset(&hints, 0, sizeof hints);
  hints.ai_family = AF_UNSPEC;
  hints.ai_socktype = SOCK_STREAM;  // We want to use TCP to ensure it gets there
  hints.ai_flags = AI_PASSIVE;  // Just use the server's IP.
  int return_value = getaddrinfo(NULL, SERVERPORT, &hints, &server_info);
  if (return_value != 0) {
    fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(return_value));
    exit(1);
  }

  // We end up with a linked-list of addresses, and we want to connect to the
  // first one we can
  for (p = server_info; p != NULL; p = p->ai_next) {
    // Try to make a socket with this one.
    if ((sockfd = socket(p->ai_family, p->ai_socktype, p->ai_protocol)) == -1) {
      // Something went wrong getting this socket, so we can try the next one.
      perror("server: socket");
      continue;
    }
    // We want to be able to reuse this, so we can set the socket option.
    int yes = 1;
    if (setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(int)) == -1) {
      perror("setsockopt");
      exit(1);
    }
    // Try to bind that socket.
    if (bind(sockfd, p->ai_addr, p->ai_addrlen) == -1) {
      // If something went wrong binding this socket, we can close it and
      // move on to the next one.
      close(sockfd);
      perror("server: bind");
      continue;
    }

    // If we've made it this far, we have a valid socket and can stop iterating
    // through.
    break;
  }

  // If we haven't gotten a valid sockaddr here, that means we can't connect.
  if (p == NULL) {
    fprintf(stderr, "server: failed to bind\n");
    exit(2);
  }

  // Otherwise, we're good.
  return sockfd;
}

int main(void) {

  int sockfd = get_and_bind_socket();

  // We want to listen forever on this socket
  if (listen(sockfd, /*backlog=*/1) == -1) {
    perror("listen");
    exit(1);
  }
  printf("Server waiting for connections.\n");

  struct sockaddr their_addr;  // Address information of the client
  socklen_t sin_size;
  int new_fd;
  while(1) {

    sin_size = sizeof their_addr;
    new_fd = accept(sockfd, (struct sockaddr *)&their_addr, &sin_size);
    if (new_fd == -1) {
      perror("accept");
      continue;
    }

    // Once we've accepted an incoming request, we can read from it into a buffer.
    int buffer;
    int bytes_received = recv(new_fd, &buffer, sizeof buffer, 0);
    if (bytes_received == -1) {
      perror("recv");
      continue;
    }

    // We need to unpack the received data.
    int number = unpack(buffer);
    printf("Received a request: is %d prime?\n", number);

    // Now, we can finally call the is_prime library!
    bool number_is_prime = is_prime(number);
    printf("Sending response: %s\n", number_is_prime ? "true" : "false");

    // Note that we don't have to pack a single byte.

    // We can now send it back.
    if (send(new_fd, &number_is_prime, sizeof number_is_prime, 0) == -1) {
      perror("send");
    }
    close(new_fd);
  }

}