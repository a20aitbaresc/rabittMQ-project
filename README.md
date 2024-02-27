Instal·lació RabbitMQ:
-  Abans de continuar ves a la pagina de erlang i descarrega-ho https://www.erlang.org/downloads
-  Un cop instal·lat ves a la pàgina de rabbit i click on posa Using the official installer: https://www.rabbitmq.com/install-windows.html
-  I on posa Direct Downloads i clicka en aquest instal·lador rabbitmq-server-3.12.13.exe
-  Un copinstala sobre el cmd ves a C:\Program Files\RabbitMQ Server\rabbitmq_server-3.12.0\sbin i poses el seguent rabbitmq-plugins enable rabbitmq_management
-  Un cop hagis acabat el procés d’instal·lació pica la tecla Windows busca services dins de services busca RabbitMQ apagar i encendre’l.
-  Un cop encès posem aquesta url http://localhost:15672/ i per iniciar sessió es guest i contrasenya guest.
-  Quan obris un nou projecte de visual, introdueix a la terminal la següent linea: 
-  npm init -y i tot seguit: npm install amqplib socket.io express
