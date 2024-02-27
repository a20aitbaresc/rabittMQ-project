**Objectiu de l'Activitat**

Desenvolupar un sistema de xat en temps real que utilitzi WebSockets per a la comunicació entre el client i el servidor, i RabbitMQ com broker de missatges per a gestionar i distribuir els missatges entre els clients connectats.

**Descripció**

Els estudiants rebreu dos arxius parcialment complets: index.HTML per al costat del client i server.js per al costat del servidor. Hauran de completar les seccions que manca del codi

**Enunciat de l'Activitat**

Completar el Client (index.HTML): Implementar la lògica per a obtenir els elements del DOM necessaris, completar les funcions ws.onmessage i form.onsubmit per a gestionar els missatges entrants i l'enviament de nous missatges.
Completar el Servidor (server.js): Implementar la funció connectRabbitMQ per a connectar amb RabbitMQ i crear un canal, completar la lògica per a consumir missatges de la cua i enviar-los als clients connectats, i gestionar la recepció de missatges des del client per a publicar-los en la cua.
