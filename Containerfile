# ARM 64/v8
FROM mongo@sha256:22fe59c3baf283535fcd6daa5a496779a8ad9dbd1ccaddcdd34d0074a87169aa
MAINTAINER Stu Cunliffe,UK s_cunliffe@uk.ibm.com
ENV http_proxy http://9.196.156.29:3128
ENV https_proxy http://9.196.156.29:3128
RUN mkdir /home/mongodb && chown mongodb:mongodb /home/mongodb
#ENV MONGO_INITDB_ROOT_USERNAME=root
#ENV MONGO_INITDB_ROOT_PASSWORD=abc123
#ENV MONGO_DB_NAME=airbnb
#ENV MONGO_COLLECTION_NAME=chicago_listings
#ENV MONGO_DB_TYPE=csv
EXPOSE 27017
COPY chicago_listings.csv.gz /tmp/chicago_listings.csv.gz
RUN gunzip /tmp/chicago_listings.csv.gz
COPY seed_airbnb.sh /docker-entrypoint-initdb.d/seed_airbnb.sh
RUN chmod 755 /docker-entrypoint-initdb.d/seed_airbnb.sh
USER mongodb
