- create a page with start game
- on load. connect to socket server. and create a channel.
  - after creating the channel. generate a link for the other person to join the channel.
    - when the other person clicked the link. connect to socket and tell the first person that they joined.
    - once a person is joined. no other persons are allowed to join. this is a one-one channel.
    - register the disconnect event and handle the above logic accordingly.
  - when the second person is joined. register for icecandidate listener.
    create the rtc offer and transmit to the other person.
