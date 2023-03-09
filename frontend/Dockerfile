# Copyright (c) HashiCorp, Inc.
# SPDX-License-Identifier: MPL-2.0

FROM node:14

WORKDIR /usr/share/app

COPY package*.json ./
COPY frontend.js ./
COPY public/ ./public/
COPY views/ ./views/

RUN npm install
EXPOSE 80

# FIXME: Make env passing work
ENV BACKEND_URL=http://localhost:30002

CMD ["node", "frontend.js"]
