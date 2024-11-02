<<<<<<< HEAD
# ColorME - Color Vision Deficiency Simulation and Analysis Tool

## Overview
ColorME is an advanced tool for simulating and analyzing how websites and applications appear to users with various types of color vision deficiencies. It combines multiple simulation algorithms with AI-powered analysis to provide comprehensive accessibility insights.

## Key Features

### 1. Advanced Color Vision Simulation
- Multiple simulation algorithms:
  - Machado (2009)
  - Viénot (1999) 
  - Brettel (1997)
  - Kotera (1999)
  - Meyer-Gross
- Support for various color vision deficiencies:
  - Protanopia (red-blind)
  - Deuteranopia (green-blind)
  - Tritanopia (blue-blind)
  - Achromatopsia (complete color blindness)
  - Partial variants (anomalous trichromacy)

### 2. GPU-Accelerated Processing
- GPU-accelerated color transformations
- Multiple color space support (RGB, LMS, LAB)
- Performance optimization for different image sizes

### 3. AI-Powered Analysis
- Integration with ARIA service for:
  - Contrast analysis
  - Readability assessment
  - Element detection
  - Color confusion areas
  - Visual hierarchy evaluation

### 4. Interactive Element Analysis
- Real-time website analysis
- Interactive element detection
- Accessibility recommendations
- Dynamic accessibility scoring
- Issue detection and analysis

## Getting Started

### Installation

First, clone the repository and install dependencies:
=======
# color-ux-access
AI-based UX testing from the perspective of simulated colorblind web users. Powered by Rhymes.ai's Aria.

## Getting Started

1. **Clone this repository**
2. **Create a virtual environment**: `python -m venv venv`
3. **Activate the virtual environment**:
	* On Unix or MacOS: `source venv/bin/activate`
	* On Windows: `venv\Scripts\activate`
4. **Install dependencies**: `pip install -r requirements.txt`
5. **Install Playwright browsers**: `playwright install`

## Process
The testing process involves:

1. Launching a web browser using Playwright
2. Taking a screenshot and passing it to a computer vision library (OpenCV or alternatives)
3. Applying a colorblind filter
4. Trying to follow a workflow
5. Asking ARIA image model for coordinates to click on
6. Passing coordinates to an automation library and clicking
7. Continuing until the workflow is complete
8. Failing the test if ARIA is unable to click
9. Recording a video and providing feedback
## Running Tests

Run the entire test suite with:
```
pytest
```

Run a specific test script (must start with 'test') with:

```
pytest test_example.py
```

>>>>>>> 084d0d7f2c93c6274f6a93a881e60fabc385651a
