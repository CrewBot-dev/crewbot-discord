FROM node:16

# Copy package.json (this is done separately so that package install is cached)
COPY ./package.json /package.json

# Install packages
RUN yarn --dev

# Copy full project
COPY . /

RUN yarn build

# Start project
CMD yarn start
