# 🛠️ OilSands Wear Prediction Model

**Author:** Komal Nayan Galla  
**Lead:** Matthew Barton  
**Manager:** Christopher Murphy  
**Technologies:** HTML, CSS, JavaScript, jQuery  
**Project Type:** Web-Based Application  

---

## 📌 Overview

The **OilSands Wear Prediction Model** is a web-based application designed to predict the **Best to Worst Case Lifetimes** of various parts used in oil sands operations, including:

- **IMP** (Impellers)  
- **VOL** (Volute Liners)  
- **FPLI** (Frame Plate Liner Inserts)  
- **TB** (Throat Bushes)

---

## ⚙️ Key Features

- **Unit Flexibility:**  
  Accepts **Metric** values by default, with the option to switch to **Imperial** units.

- **Dynamic Inputs:**  
  - **Dimensions** vary based on the selected **Part IPN**.  
  - **Process Parameters** change depending on the **Application** and **Mine Site** combination.

- **Wear Coefficient Calculation:**  
  A numeric factor that considers:
  - Impact Force  
  - Particle Size & Geometry  
  - Particle Material  
  - Corrosion  
  - Erosion  
  - And other environmental and operational factors

---

## 🧠 Data Handling

- **Default Values:**  
  Dimensions and Duty Conditions (also known as **Process Parameters**) are stored in **JSON format** within the script section of the HTML file.

- **Note:**  
  Due to **organizational policies**, external script files could not be used. All scripts and data are embedded directly in the HTML.

---


