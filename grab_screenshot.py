from easyprocess import EasyProcess
import pyscreenshot as ps
from pyvirtualdisplay.smartdisplay import SmartDisplay, Display
from castro import Castro
import time

count = 0
castro = Castro()
castro.start()
EasyProcess('google-chrome http://www.youtube.com')
time.sleep(10)
castro.stop()
