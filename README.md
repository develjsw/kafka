# KAFKA

### kafka 기본 구성
- docker compose1
  - kafka cluster - zookeeper (docker image)
  - kafka broker - bitnami/kafka (docker image)
    - broker count : 3 (leader 1, followers 2)
    - partition count : 9
  - kafka UI - provectuslabs/kafka-ui (docker image)
  - producer API - (NestJS docker image)
- docker compose2 (consumer API - NestJS)

### kafka 환경별 구성
- local 환경
  - kafka cluster : docker image
  - kafka broker : docker image
  - kafka UI : docker image
  - producer API : windows OS (local)
  - consumer API : windows OS (local)
- development 환경 (AWS EC2)
  - kafka cluster : docker image
  - kafka broker : docker image
  - kafka UI : docker image
  - producer API : docker image
  - consumer API : docker image
  <h6>** 추후 AWS에서 제공하는 kafka service인 MSK로 전환 예정 **</h6>
