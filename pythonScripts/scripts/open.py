import cv2
import pytesseract
import imutils
import numpy as np

import sys
def show(img):
   # resize = ResizeWithAspectRatio(img, width=1280) 
   ri= cv2.resize(img, (1600, 990))

   while cv2.waitKeyEx(1):
        cv2.imshow("after",ri)

def ResizeWithAspectRatio(image, width=None, height=None, inter=cv2.INTER_AREA):
    dim = None
    (h, w) = image.shape[:2]

    if width is None and height is None:
        return image
    if width is None:
        r = height / float(h)
        dim = (int(w * r), height)
    else:
        r = width / float(w)
        dim = (width, int(h * r))

    return cv2.resize(image, dim, interpolation=inter)

#Reaad the img
img = cv2.imread(sys.argv[1])#'./pythonScripts/scripts/car3.jpg'

# convert to graycale image
gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
#show(gray)
#removes noise 
gray = cv2.bilateralFilter(gray,11,17,17)
#show(gray)
# canny edge dectection
canny_edge = cv2.Canny(gray,30,200)
#show(canny_edge)

# find contours based on edges
#the code below needs an -or else ull get a valuerror: too many values to unpack (expected 2) or a numpy error
keypoints= cv2.findContours(canny_edge.copy(),cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
contours = imutils.grab_contours(keypoints)
contours = sorted(contours,key=cv2.contourArea,reverse=True)[:10]

#print(contours)
#initialize licence plate contour and x,y coordinates
contour_with_license_plate = None
license_plate = None
x = None
y = None
w = None
h = None
flag = False
#Find the contour with 4 potential corners and create a region of interest around it
for contour in contours:
   perimeter = cv2.arcLength(contour,True)
   approx = cv2.approxPolyDP(contour,perimeter*0.02,True)
   #print(approx)
    #this checks if it's a rectangle
   if len(approx)==4:
       contour_with_license_plate=approx
       flag = True
      #  x,y,w,h=cv2.boundingRect(contour)
       # license_plate = gray[y:y+h,x:x+w]
       break

#print(contour_with_license_plate)
if (flag == False):
     print("no contour found!")
     exit()
     

#Masking
mask = np.zeros(gray.shape,np.uint8)
new_image = cv2.drawContours(mask,[contour_with_license_plate],0,500,-1)
new_image = cv2.bitwise_and(gray,gray,mask=mask)
#show(new_image)

#isolate nunbr pate

(x,y) = np.where(mask==255)
(x1,y1) = (np.min(x),np.min(y))
(x2,y2) = (np.max(x),np.max(y))
cropped_img = gray[x1-30:x2+30,y1-30:y2+30]
#brigthness
br_img = cv2.cvtColor(cropped_img,cv2.COLOR_BAYER_BG2RGB)
#show(cropped_img)



#use ocr to extract the text
text = pytesseract.image_to_string(new_image,config='--psm 6')
print("license plate is : ", text.upper())

#display it on the picture

#(thresh,blackAndWhiteImage) = cv2.threshold(license_plate,80,255,cv2.THRESH_BINARY)
#show(blackAndWhiteImage)

    #cv2.waitKeyEx(1)
#cv2.destroyAllWindows()
##cv2.waitKey(1)

# print("version")
# print(cv2.__version__)
# img = cv2.imread("logo.jpeg")


# cv2.imshow("before",img)
# cv2.imshow("after",gray)

# cv2.waitKey(0)
# cv2.destro
