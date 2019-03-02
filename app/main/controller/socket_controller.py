from .. import socketio

@socketio.on('connect')
def connectClient():
    print(">>>>>>>>> Client Connected")

@socketio.on('disconnect')
def disConnectClient():
    print(">>>>>>>>> Client Disconnected")
