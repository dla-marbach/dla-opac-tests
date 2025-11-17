FROM node:22-bookworm

#Test-Repository kopieren
RUN mkdir /dla-opac-tests
COPY . /dla-opac-tests
WORKDIR /dla-opac-tests

RUN npm install
RUN npm install @playwright/test@1.56.1
RUN npx -y playwright install --with-deps
