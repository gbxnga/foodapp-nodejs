FROM node:10  

WORKDIR /srv/app 

COPY . /srv/app  

RUN npm install  

 

EXPOSE 8081
EXPOSE 3000 
EXPOSE 80

RUN npm install -g nodemon
RUN npm install -g jest  

#CMD [ "nodemon", "l", "index.js" ]  
CMD ["npm", "run", "prod"]