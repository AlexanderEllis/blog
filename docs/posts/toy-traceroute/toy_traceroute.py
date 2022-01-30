import socket

DESTINATION = 'example.com'
DESTINATION_PORT = 33434
MESSAGE = 'foo'


def main():
    # Get the destination ip address.
    destination_ip = socket.gethostbyname(DESTINATION)
    print('Tracing the route to {0}'.format(destination_ip))

    # Prepare a socket to send UDP packets.
    sending_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sending_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    # Prepare a socket to listen for ICMP messages.
    # Note: the middle argument _may_ be SOCK_RAW, but since I'm running this
    # on a mac, I had to use SOCK_DGRAM to avoid needing root privileges.
    # See https://apple.stackexchange.com/questions/312857/how-does-macos-allow-standard-users-to-ping.
    receiving_socket = socket.socket(
        socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_ICMP)

    # Show the ICMP header, since that's where the router address is.
    receiving_socket.setsockopt(socket.SOL_IP, socket.IP_HDRINCL, 1)

    # Initialize the variables we'll use for seeing if we're done and keeping
    # track of the current hop.
    received_ip = None
    current_hop = 1
    while received_ip != destination_ip:
        # Set the socket's TTL to the current hop so that the packet just
        # reaches it before being stopped.
        sending_socket.setsockopt(
            socket.IPPROTO_IP, socket.IP_TTL, current_hop)

        # Attempt to send a UDP packet to the destination ip.
        sending_socket.sendto(bytes(MESSAGE, 'utf-8'),
                              (destination_ip, DESTINATION_PORT))

        # Receive any incoming ICMP packet. We can ignore the first return
        # value from recvfrom, which would be the included data.
        _, addr = receiving_socket.recvfrom(1500)
        received_ip = addr[0]
        print('Current hop {0}: ICMP message received from {1}'.format(
            current_hop, received_ip))
        current_hop = current_hop + 1


if __name__ == '__main__':
    main()
