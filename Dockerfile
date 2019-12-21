FROM node:10  

WORKDIR /app 

COPY package.json package.json  

RUN npm install  

COPY . .  

EXPOSE 8081
EXPOSE 3000 
EXPOSE 80

RUN npm install -g nodemon  

#CMD [ "nodemon", "l", "index.js" ]  
CMD ["npm", "run", "dev"]