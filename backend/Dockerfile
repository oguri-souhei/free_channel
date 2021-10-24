FROM ruby:3.0.2

RUN apt-get update -qq \
  && apt-get install -y curl apt-transport-https wget \
  && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
  && apt-get update && apt-get install -y yarn \
  && apt-get install -y nodejs

WORKDIR /app

COPY . /app
RUN bundle install

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

RUN mkdir -p tmp/sockets
VOLUME /app/public
VOLUME /app/tmp

CMD [ "bundle", "exec", "pumactl", "start" ]