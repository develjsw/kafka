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

<hr>

## 예제 (개발 서버 기준)

### EC2 인스턴스 생성
- 이름 및 태그 : kafka-server
- Amazon Machine Image : Amazon Linux
- 인스턴스 유형 : t2.micro
- 키 페어 : 이름, RSA, .pem 선택 및 입력 후 생성
- 네트워크 설정 : 보안그룹 생성, SSH 트래픽 허용 체크 후 생성
- 스토리지 구성 : 30 Gib

### EC2 접속
- ec2-user / 생성해둔 key pair 선택하여 로그인

### Swap 영역 생성
- AWS EC2 t2.micro의 RAM은 1GB 밖에 되지 않아 추후 서버 메모리 부족으로 broker 3개가 죽는 현상이 발생하므로 Swap 영역을 생성하여 이슈 사전 방지
- 프리티어가 아닌 실제 운영 서비스에서는 높은 사양의 인스턴스를 사용하게 될 것이므로 이슈 발생 X
  ~~~
  # 2GB 크기의 빈 파일을 /swapfile 이름으로 생성
  $ sudo dd if=/dev/zero of=/swapfile bs=128M count=16
  
  # /swapfile의 권한을 소유자만 읽고 쓸 수 있도록 설정
  $ sudo chmod 600 /swapfile
  
  # /swapfile을 스왑 공간으로 사용할 수 있도록 포맷
  $ sudo mkswap /swapfile
  
  # 시스템에서 /swapfile을 사용할 수 있도록 활성화
  $ sudo swapon /swapfile
  
  # 현재 활성화된 스왑 파티션이나 파일 정보를 표시
  $ sudo swapon -s
  
  # /etc/fstab 파일을 편집하여 스왑 파일 설정을 변경
  $ sudo vi /etc/fstab
     # 파일 끝에 아래 내용 입력 후 저장
     /swapfile swap swap defaults 0 0
  
  # 추가된 free 공간 확인
  $ free -h
  ~~~

### 방화벽 설정 (=보안그룹 설정)
- AWS console login → AWS EC2 인스턴스 → 보안 → 보안 그룹 → 인바운드 규칙 → 인바운드 규칙 편집 →
  1. 사용자 지정 TCP, 9090, 내 IP 추가 (kafka UI 방화벽 허용)
  2. 사용자 지정 TCP, 7777, 내 IP 추가 (kafka producer API 방화벽 허용)
  3. 사용자 지정 TCP, 9095-9097, 0.0.0.0/0 (kafka broker 1,2,3 외부 리스너용 방화벽 허용) 
  4. 사용자 지정 TCP, 2181, 내 IP 추가 (kafka zookeeper 방화벽 허용)

### Docker 설치
  ~~~
  # yum 패키지 업데이트
  $ sudo yum update -y
  
  # docker 설치
  $ sudo yum install -y docker
  
  # docker 설치/상태/버전 확인
  $ rpm -qa | grep docker
  $ sudo systemctl status docker
  $ docker --version
  
  # docker 데몬 시작, 부팅 시 자동 재시작
  $ sudo systemctl start docker
  $ sudo systemctl enable docker
  
  # 현재 사용자를 docker 그룹에 추가하여 sudo없이 docker 명령어 사용할 수 있도록 변경
  $ sudo usermod -a -G docker ec2-user
  
  # 변경사항 session 적용을 위한 명령어
  $ newgrp docker
  ~~~

### Docker Compose 설치
  ~~~
  # 최신 버전의 docker compose 다운로드
  $ sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  
  # 다운로드한 docker compose 바이너리에 실행 권한 부여 
  $ sudo chmod +x /usr/local/bin/docker-compose
  
  # 설치 확인
  $ docker-compose --version
  ~~~

### Git 설치
  ~~~
  $ sudo yum install git -y
  ~~~

### 최신 소스코드 서버에 가져오기
  ~~~
  # 디렉토리 생성
  $ sudo mkdir /data
  
  # 생성한 디렉토리에 최신소스 코드 가져오기
  $ cd /data
  $ sudo git clone https://github.com/develjsw/kafka.git
  ~~~

### Docker Compose 실행
  ~~~
  # 작업 디렉토리로 이동
  $ cd /data/kafka
  
  # docker compose 실행
  $ docker-compose -f docker-compose-development.yml up -d --build
  ~~~

### 정상동작 확인
~~~
# 아래 명령어 실행 후 Error 없는지 확인
$ docker logs kafka-1
$ docker logs kafka-2
$ docker logs kafka-3
$ docker logs zookeeper
$ docker logs kafka-producer-1

# producer API 호출 후 아래 명령어에 Error 없는지 확인
$ docker logs kafka-producer-1
~~~

### 파티션 수 확인

### 파티션 수 증설