from http.server import BaseHTTPRequestHandler, HTTPServer
import contextlib
import irsdk
import json

ir = irsdk.IRSDK()
ir.startup()

TIRE_ATTRS = ["tempCL", "tempCM", "tempCR", "wearL","wearM","wearR"]
TIRE_POS = ["RR", "RF", "LR", "LF"]

def utilities(self):
  self.send_response(200)
  self.send_header('Content-type', 'application/json')
  self.end_headers()
  
  response = {
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
  }

  self.wfile.write(json.dumps(response).encode())

def pedals(self):
  self.send_response(200)
  self.send_header('Content-type', 'application/json')
  self.end_headers()
  
  response = {
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
  }
  self.wfile.write(json.dumps(response).encode())

def deltaTime(self):
  self.send_response(200)
  self.send_header('Content-type', 'application/json')
  self.end_headers()
  response = {
    "lapDeltaToSessionBestLap": ir["LapDeltaToSessionBestLap"],
    "lapDeltaToSessionBestLapDD": ir["LapDeltaToSessionBestLap_DD"]
  }
  self.wfile.write(json.dumps(response).encode())

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
  def log_message(self, format, *args):
    pass

  def do_GET(self):
    if self.path == '/pedals':
      pedals(self)
    if self.path == '/deltaTime':
      deltaTime(self)
    if self.path == '/drivers':
      utilities(self)

def run():
    server_address = ('localhost', 8000)
    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    httpd.serve_forever()

if __name__:
  while True:
    try:
      run()
    except:
      print("err")