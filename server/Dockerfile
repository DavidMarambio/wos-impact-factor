#
# ---- Base Node ----
FROM node:14-slim AS base
# set working directory
WORKDIR /app
# copy project file
COPY package*.json ./
 
#
# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm install
 
#
# ---- Test ----
# run linters, setup and tests
FROM dependencies AS test
COPY . .
RUN  npm run lint && npm run test

#
# ---- Build ----
FROM dependencies AS build
COPY . .
RUN npm run build
 
#
# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /app/node_modules ./node_modules
# copy app sources
COPY --from=build /app/dist ./dist
COPY package*.json ./
# expose port and define CMD
EXPOSE 3000
CMD npm run start