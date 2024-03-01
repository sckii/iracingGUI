#!/usr/bin/env python
from tornado.options import options, define, parse_command_line
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.wsgi
import tornado.websocket
import json
import irsdk

ir = irsdk.IRSDK()
ir.startup()

define('port', type=int, default=8888)

class HelloHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("client.html")

class clientJS(tornado.web.RequestHandler):
    def get(self):
        f = open("client.js","r")
        self.write(f.read())
        f.close()

class MyWebSocket(tornado.websocket.WebSocketHandler):
    clients = []

    def check_origin(self, origin):
        return True
    
    def open(self):
        # clients must be accessed through class object!!!
        MyWebSocket.clients.append(self)
        print ("\nWebSocket opened")

    def on_message(self, message):
        msg = {}
        if (json.loads(message)["event"] == "pedals"):
            msg = json.dumps({
                "break": ir["Brake"],
                "throttle": ir["Throttle"],
                "gear": ir["CarIdxGear"],
                "speed": ir["Speed"],
                "clutch": ir["Clutch"],
                "playerCarMyIncidentCount": ir["PlayerCarMyIncidentCount"],
                "sessionFlags": ir["SessionFlags"],
                "sessionLapsTotal": ir["SessionLapsTotal"],
                "sessionLapsRemainEx": ir["SessionLapsRemainEx"],
                "sessionTime": ir["SessionTime"],
            })

        if (json.loads(message)["event"] == "deltaBar"):
            msg = json.dumps({
                "lapDeltaToSessionBestLap": ir["LapDeltaToSessionBestLap"],
                "lapDeltaToSessionBestLapDD": ir["LapDeltaToSessionBestLap_DD"]
            })
        
        if (json.loads(message)["event"] == "utilities"):
            msg = json.dumps({
                "fuelLevel": ir["FuelLevel"],
                "fuelLevelPct": ir["FuelLevelPct"],
                "tires": {
                'RRtempCL': ir['RRtempCL'],
                'RRtempCM': ir['RRtempCM'],
                'RRtempCR': ir['RRtempCR'],
                'RRwearL': ir['RRwearL'],
                'RRwearM': ir['RRwearM'],
                'RRwearR': ir['RRwearR'],
                'RFtempCL': ir['RFtempCL'],
                'RFtempCM': ir['RFtempCM'],
                'RFtempCR': ir['RFtempCR'],
                'RFwearL': ir['RFwearL'],
                'RFwearM': ir['RFwearM'],
                'RFwearR': ir['RFwearR'],
                'LRtempCL': ir['LRtempCL'],
                'LRtempCM': ir['LRtempCM'],
                'LRtempCR': ir['LRtempCR'],
                'LRwearL': ir['LRwearL'],
                'LRwearM': ir['LRwearM'],
                'LRwearR': ir['LRwearR'],
                'LFtempCL': ir['LFtempCL'],
                'LFtempCM': ir['LFtempCM'],
                'LFtempCR': ir['LFtempCR'],
                'LFwearL': ir['LFwearL'],
                'LFwearM': ir['LFwearM'],
                'LFwearR': ir['LFwearR']}
            })

        for c in MyWebSocket.clients:
            c.write_message(msg)

    def on_close(self):
        print ("WebSocket closed")
        # clients must be accessed through class object!!!
        MyWebSocket.clients.remove(self)

def main():
    tornado_app = tornado.web.Application([
      ('/', HelloHandler),
      ('/websocket', MyWebSocket),
      ('/client.js', clientJS),
      ])
    server = tornado.httpserver.HTTPServer(tornado_app)
    server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == '__main__':
    main()