import io
import json
import numpy as np
from PIL import Image
from typing import Dict
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf

app = FastAPI(title="Traffic Sign Classifier API")

# Allow requests from React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "traffic_sign_model.h5" 

# --- Load model at startup ---
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    model_input_shape = model.input_shape  
    _, H, W, C = model_input_shape
    print(f"Loaded model '{MODEL_PATH}' with input shape: {model_input_shape}")
except Exception as e:
    raise RuntimeError(f"Failed to load model at '{MODEL_PATH}': {e}")


# --- class info mapping (paste your mapping here) ---
CLASS_INFO: Dict[str, Dict[str, str]] = {
  "0": {"title": "Speed limit (5km/h)", "description": "Indicates that the maximum permitted driving speed in this zone is 5 kilometers per hour, typically used in very restricted or high-risk pedestrian areas."},
  "1": {"title": "Speed limit (15km/h)", "description": "Indicates a maximum speed limit of 15 kilometers per hour, usually found in residential lanes, campuses, or highly congested zones."},
  "2": {"title": "Speed limit (30km/h)", "description": "Marks a maximum speed of 30 kilometers per hour, commonly used in school zones or areas requiring slow and cautious driving."},
  "3": {"title": "Speed limit (40km/h)", "description": "Shows that drivers must not exceed 40 kilometers per hour, often used in moderately busy roads or semi-urban areas."},
  "4": {"title": "Speed limit (50km/h)", "description": "Indicates a maximum speed of 50 kilometers per hour, generally applied in urban zones with steady but controlled traffic flow."},
  "5": {"title": "Speed limit (60km/h)", "description": "Sets the maximum speed at 60 kilometers per hour, frequently used on wider city roads or low-traffic urban connectors."},
  "6": {"title": "Speed limit (70km/h)", "description": "Indicates that vehicles may travel up to 70 kilometers per hour, often seen on suburban or lightly developed roadways."},
  "7": {"title": "Speed limit (80km/h)", "description": "Warns drivers that the maximum speed allowed is 80 kilometers per hour, typically on highways or major connecting routes."},
  "8": {"title": "Don't Go Straight or Left", "description": "Prohibits vehicles from continuing straight or making a left turn, guiding drivers to choose an alternative legal direction."},
  "9": {"title": "Don't Go Straight or Right", "description": "Indicates that drivers may not continue straight or turn right, restricting movement to permitted directions only."},
  "10": {"title": "Don't Go Straight", "description": "Shows that continuing straight ahead is not allowed, usually directing drivers to turn left or right instead."},
  "11": {"title": "Don't Go Left", "description": "Prohibits left turns at the intersection or junction ahead for safety or traffic flow control."},
  "12": {"title": "Don't Go Left or Right", "description": "Restricts both left and right turns, commonly indicating a mandatory straight movement or a controlled path."},
  "13": {"title": "Don't Go Right", "description": "Indicates that right turns are not allowed, guiding drivers to continue straight or turn left."},
  "14": {"title": "Don't Overtake from Left", "description": "Warns drivers not to overtake another vehicle from the left side, promoting safe overtaking practices."},
  "15": {"title": "No U-turn", "description": "Prohibits drivers from performing a U-turn at or beyond this sign, ensuring smoother traffic flow and preventing sudden reversals."},
  "16": {"title": "No Car", "description": "Indicates that motor vehicles are not allowed beyond this point, usually for pedestrian or restricted zones."},
  "17": {"title": "No Horn", "description": "Instructs drivers not to use horns in the area, typically near hospitals, schools, or silence zones."},
  "18": {"title": "Speed limit (40km/h)", "description": "Sets the maximum speed to 40 kilometers per hour in this particular zone for safety and regulation."},
  "19": {"title": "Speed limit (50km/h)", "description": "Restricts vehicle speed to a maximum of 50 kilometers per hour, promoting safe driving conditions."},
  "20": {"title": "Go Straight or Right", "description": "Informs drivers that the allowed directions are straight ahead or a right turn."},
  "21": {"title": "Go Straight", "description": "Indicates a mandatory straight movement, meaning drivers must continue forward only."},
  "22": {"title": "Go Left", "description": "Instructs drivers to make a left turn as the only mandatory direction."},
  "23": {"title": "Go Left or Right", "description": "Allows drivers to turn either left or right but not continue straight."},
  "24": {"title": "Go Right", "description": "Indicates that the only allowed direction is a right turn."},
  "25": {"title": "Keep Left", "description": "Directs drivers to stay to the left side of the road or divider for proper lane discipline."},
  "26": {"title": "Keep Right", "description": "Directs drivers to remain on the right side of the road or divider for safer navigation."},
  "27": {"title": "Roundabout Mandatory", "description": "Indicates the presence of a roundabout ahead and instructs vehicles to navigate through it in the mandated direction."},
  "28": {"title": "Watch Out for Cars", "description": "Alerts pedestrians and drivers of potential sudden vehicle movement or busy vehicle crossings."},
  "29": {"title": "Horn", "description": "Indicates that sounding the horn is either allowed or required for safety, typically in blind-spot areas."},
  "30": {"title": "Bicycles Crossing", "description": "Warns drivers of a bicycle crossing ahead, urging reduced speed and extra caution."},
  "31": {"title": "U-turn", "description": "Indicates that making a U-turn is allowed at this location."},
  "32": {"title": "Road Divider", "description": "Alerts drivers about an approaching divider or median that separates lanes of traffic."},
  "33": {"title": "Traffic Signals", "description": "Warns drivers of a signalized intersection ahead, encouraging them to prepare to stop or slow down."},
  "34": {"title": "Danger Ahead", "description": "General warning sign indicating a potential hazard ahead that requires increased caution."},
  "35": {"title": "Zebra Crossing", "description": "Indicates a pedestrian crossing zone requiring drivers to slow down and give way to walkers."},
  "36": {"title": "Bicycles Crossing", "description": "Signals the presence of a bicycle crossing area where drivers must be alert for cyclists."},
  "37": {"title": "Children Crossing", "description": "Alerts drivers to the presence of children, often near schools or playgrounds, requiring reduced speed and vigilance."},
  "38": {"title": "Dangerous Curve to the Left", "description": "Warns of a sharp or potentially hazardous leftward bend ahead, requiring slower and controlled driving."},
  "39": {"title": "Dangerous Curve to the Right", "description": "Alerts drivers to a risky rightward curve ahead, urging careful maneuvering."},
  "40": {"title": "Downhill Ahead", "description": "Indicates a steep descending slope ahead, advising drivers to maintain low gear and exercise caution."},
  "41": {"title": "Uphill Ahead", "description": "Warns of an ascending road section where vehicles may require more power and slower speeds."},
  "42": {"title": "Slow", "description": "Instructs drivers to reduce speed immediately due to road conditions, hazards, or special areas ahead."},
  "43": {"title": "Go Right or Straight", "description": "Indicates that drivers are permitted to proceed straight or make a right turn only."},
  "44": {"title": "Go Left or Straight", "description": "Allows drivers to continue forward or turn left, restricting right turns."},
  "45": {"title": "Village Ahead", "description": "Warns that a village area is approaching, requiring slower driving and increased awareness of pedestrians and animals."},
  "46": {"title": "ZigZag Curve", "description": "Indicates a series of sharp alternating curves requiring cautious and reduced-speed navigation."},
  "47": {"title": "Train Crossing", "description": "Warns drivers of an upcoming railway crossing, urging them to be ready to stop for passing trains."},
  "48": {"title": "Under Construction", "description": "Alerts drivers that road construction or maintenance work is underway, requiring slower and careful movement."},
  "49": {"title": "Continuous Curves Ahead", "description": "Indicates multiple curves ahead, requiring sustained caution and reduced speed."},
  "50": {"title": "Fences", "description": "Warns of fenced or restricted areas near the roadway, often to protect livestock, property, or pedestrians."},
  "51": {"title": "Heavy Vehicle Accidents", "description": "Alerts drivers to a zone with a high risk of heavy-vehicle related incidents or dangerous gradients."},
  "52": {"title": "Stop", "description": "Instructs drivers to come to a complete stop and proceed only when it is safe to do so."},
  "53": {"title": "Give Way", "description": "Indicates that drivers must yield to oncoming traffic before proceeding."},
  "54": {"title": "No Stopping", "description": "Prohibits vehicles from stopping at any time along this stretch of road."},
  "55": {"title": "No Entry", "description": "Indicates that entry into the road or lane ahead is not allowed for vehicles."},
  "56": {"title": "Yield", "description": "Instructs drivers to slow down and yield the right-of-way to other vehicles or pedestrians."},
  "57": {"title": "Check", "description": "Alerts drivers to perform necessary checks, such as inspection, documentation verification, or stopping for control posts."}
}

# --- helper: preprocess an image file into model input ---
def preprocess_image_bytes(image_bytes: bytes):
    """
    Takes raw image bytes -> returns np.array shaped (1, H, W, C) ready for model.predict
    Auto-adapts to model's expected channel count (C).
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {e}")

    # convert & resize
    img = img.convert('RGB')  # start with RGB always
    # if model expects grayscale (1 channel), we will convert later
    target_size = (W, H)  # note: model.input_shape was (None, H, W, C)
    img = img.resize(target_size, resample=Image.BILINEAR)

    # Decide channels
    expected_channels = C if (isinstance(C, int) and C is not None) else 3
    if expected_channels == 1:
        img = img.convert('L')  # grayscale

    arr = np.array(img).astype('float32') / 255.0

    # If grayscale the array shape is (H,W), add channel axis
    if expected_channels == 1 and arr.ndim == 2:
        arr = np.expand_dims(arr, axis=-1)

    # If model expects single channel but the array has 3 channels, convert
    if expected_channels == 1 and arr.shape[-1] == 3:
        # convert to grayscale by averaging channels
        arr = np.mean(arr, axis=-1, keepdims=True)

    # If model expects 3 channels but array has 1 channel, replicate
    if expected_channels == 3 and arr.shape[-1] == 1:
        arr = np.concatenate([arr, arr, arr], axis=-1)

    # Add batch dimension
    arr = np.expand_dims(arr, axis=0)
    return arr


# --- Prediction endpoint ---
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accepts an uploaded image file and returns predicted class index, title, description and confidence.
    """
    # Basic validation for image content type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    contents = await file.read()
    try:
        x = preprocess_image_bytes(contents)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Preprocessing error: {e}")

    # Run prediction
    try:
        preds = model.predict(x)
        # preds shape (1, num_classes)
        prob = float(np.max(preds))
        idx = int(np.argmax(preds, axis=1)[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model prediction error: {e}")

    # Lookup info
    info = CLASS_INFO.get(str(idx), {"title": str(idx), "description": "No description available."})

    return {
        "class_index": idx,
        "title": info["title"],
        "description": info["description"],
        "confidence": prob
    }


# --- health check ---
@app.get("/health")
def health():
    return {"status": "ok"}
