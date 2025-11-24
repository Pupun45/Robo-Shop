import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css"

const Header = ({ onLoginClick }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);
  const navigate = useNavigate();
  return (
    <>
      <header>
        <div className="navbar">
          <div className="menu-icon" onClick={toggleSidebar}>
            ☰
          </div>
          <div className="logo" />
          <div className="search-bar">
            <select >
              <option>All</option>
              <option>IoT Component</option>
              <option>Tools</option>
            </select>
            <input type="text" placeholder="Search anything..." />
            <button>Search</button>
          </div>

          <div className="location">
            <small>Location</small>
            <strong>India</strong>
          </div>

          <div
            className="account"
            onClick={onLoginClick}
            style={{ cursor: "pointer" }}
          >
            <small>Hello, sign in</small>
            <strong>&amp; Account</strong>
          </div>

          <div className="orders">
            <a href=""><small>Returns</small><br />
              <strong>&amp; Orders</strong></a>
          </div>

          <div className="cart">
            <Link to="/carts" style={{ textDecoration: "none", color: "inherit" }}>
              <strong>Cart 🛒</strong>
            </Link>
          </div>
        </div>
        <div className="second-nav">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <p>Home</p>
          </Link>
          <Link to="/shop" style={{ textDecoration: "none", color: "inherit" }}>
            <p>Shop</p>
          </Link>
          <Link to="/project" style={{ textDecoration: "none", color: "inherit" }}>
            <p>Project</p>
          </Link>
          <Link to="/wishlist" style={{ textDecoration: "none", color: "inherit" }}>
            <p>Wishlist</p></Link>
        </div>
        <marquee
          style={{
            color: "white",
            background: "teal",
            fontSize: "24px",
            padding: "5px",
          }}
          direction="left"
        >Now we give 5% discount on every product
        </marquee>
      </header>

      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div
            className="account"
            onClick={onLoginClick}
            style={{ cursor: "pointer" }}
          >
            <h3>Hello, sign in</h3>
            <br />
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" onClick={toggleSidebar} width="20" height="20" fill="currentColor" className="bi bi-x-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
          </svg>
        </div>
        <div className="sidebar-section">
          <h4
            onClick={() => {
              toggleSection("SensorsSensorModules");
              navigate("/SensorsSensorModules"); }} >
            Sensors & Sensor Modules
            <span className="arrow">
              {openSection === "SensorsSensorModules" ? "▲" : "▼"}
            </span>
          </h4>
          <div
            className={`dropdown ${openSection === "SensorsSensorModules" ? "open" : ""
              }`}
          >
            <p>Sensors & Sensor Modules</p>
            <p>Light, Sound & Colour</p>
            <p>IR, Laser, Proximity & Ultrasonic</p>
            <p>Gas, Temperature, Humidity</p>
            <p>Voltage, Current & Rotation</p>
            <p>Flex, Pressure and Vibration</p>
            <p>Biomedical Sensor</p>
            <p>Accelerometer, Magnetometer, Gyroscope</p>
            <p>Sensor Switch & Touch Switch</p>
            <p>Water, PH, Turbidity, Moisture & Flow</p>
          </div>
        </div>
        <div className="sidebar-section">
          <h4 onClick={() => toggleSection("IOT")}>
            IOT & Wireless Module
            <span className="arrow">{openSection === "IOT" ? "▲" : "▼"}</span>
          </h4>
          <div className={`dropdown ${openSection === "IOT" ? "open" : ""}`}>
            <p>GSM, GPS & GPRS</p>
            <p>All IOT & Wireless Module</p>
            <p>ESP Module, Bluetooth and WIFI Module </p>
            <p>RF, NRF, RFID, LORA and XBee</p>
          </div>
        </div>

        <div className="sidebar-section">
          <h4 onClick={() => toggleSection("Electronic")}>
            Electronic Components
            <span className="arrow">{openSection === "Electronic" ? "▲" : "▼"}</span>
          </h4>
          <div className={`dropdown ${openSection === "Electronic" ? "open" : ""}`}>
            <p>All Electronic Components</p>
            <p>IC (Integrated Circuit) & Socket</p>
            <p>Resistor</p>
            <p>Capacitor</p>
            <p>Diode, Inductor & Transistor</p>
            <p>Breadboard, Zero PCB & Copper Clad</p>
            <p>Potentiometer & Occillator</p>
            <p>Mechanical Switches</p>
            <p>Mechanical Switches</p>
            <p>Buzzer & Speaker</p>
            <p>Fuse & Holder</p>
          </div>
        </div>
        <div className="sidebar-section">
          <h4 onClick={() => toggleSection("Modules")}>
            Electronic Modules
            <span className="arrow">{openSection === "Modules" ? "▲" : "▼"}</span>
          </h4>
          <div className={`dropdown ${openSection === "Modules" ? "open" : ""}`}>
            <p>All Electronic Modules</p>
            <p>Voltage Regulator & Buck Boost</p>
            <p>SSR, Relay & Relay Modules</p>
            <p>PWM and Logic Converter</p>
            <p>PWM and Logic Converter</p>
            <p>RTC & Audio Amplifier</p>
            <p>Electronic Switches & Keypad</p>
            <p>Interface Module</p>
          </div>
        </div>
        <div className="sidebar-section">
          <h4 onClick={() => toggleSection("Boards")}>
            Development Boards
            <span className="arrow">{openSection === "Boards" ? "▲" : "▼"}</span>
          </h4>
          <div className={`dropdown ${openSection === "Boards" ? "open" : ""}`}>
            <p>All Development Boards</p>
            <p>Arduino & Accessories</p>
            <p>Raspberry Pi & Accessories</p>
            <p>PIC, ARM & Others Development Board</p>
            <p>AVR, 8051 Dev. Board & Programmer</p>
          </div>
        </div>
        <div className="sidebar-section">
          <h4 onClick={() => toggleSection("Robotics")}>
            Robotics & Mech Parts
            <span className="arrow">{openSection === "Robotics" ? "▲" : "▼"}</span>
          </h4>
          <div className={`dropdown ${openSection === "Robotics" ? "open" : ""}`}>
            <p>All Robotics & Mech Parts</p>
            <p>Nut Bolt & Washer</p>
            <p>Spacer & Standoff</p>
            <p>Motor Clamps & Bracket</p>
            <p>Wheels, Pully & Belt</p>
            <p>Chassis, Robotic Arm & Gripper</p>
            <p>Gears & Racks</p>
            <p>Coupling & Spring</p>
            <p>Mechanical Construction Strips</p>
          </div>
        </div>
        <div className="sidebar-section">
          <h4 onClick={() => toggleSection("Motors")}>
            Motors, Drivers, Actuators
            <span className="arrow">{openSection === "Motors" ? "▲" : "▼"}</span>
          </h4>
          <div className={`dropdown ${openSection === "Motors" ? "open" : ""}`}>
            <p>All Motors, Drivers, Actuators</p>
            <p>DC Geared Motor</p>
            <p>Servo & Stepper Motor</p>
            <p>Solenoid & Electromagnet</p>
            <p>DC Motor </p>
            <p>Motor Driver</p>
            <p>Vibration Motor</p>
            <p>DC Water & Air Pump</p>
            <p>Cooling Fan</p>
            <p>Motor Accessories</p>
            <p>E-Bike Parts</p>
          </div>
        </div>
        <div className="sidebar-section">
          <h4 onClick={() => toggleSection("Connectors")}>
            Connectors, Wires & Cables
            <span className="arrow">{openSection === "Connectors" ? "▲" : "▼"}</span>
          </h4>
          <div className={`dropdown ${openSection === "Connectors" ? "open" : ""}`}>
            <p>All Connectors, Wires & Cables</p>
            <p>Jumper Wire & Header Pins</p>
            <p>PVC, Silicon & Copper Wire</p>
            <p>Heat Shrink Sleeves</p>
            <p>Interfacing Cable </p>
            <p>FRC, PBT & RMC Cable</p>
            <p>Connectors</p>
          </div>
        </div>
        <div className="sidebar-section">
          <h4 onClick={() => toggleSection("Drone")}>
            Drone & RC Parts
            <span className="arrow">{openSection === "Drone" ? "▲" : "▼"}</span>
          </h4>
          <div className={`dropdown ${openSection === "Drone" ? "open" : ""}`}>
            <p>All Drone & RC Parts</p>
            <p>Drones ( UAV )</p>
            <p>BLDC Motors & ESC</p>
            <p>Frame & PDB</p>
            <p>Flight Controller and Telematry </p>
            <p>Li-Po Battery & Charger</p>
            <p>Propellers & Guard</p>
            <p>Camera &  Gimbals</p>
            <p>Transmitter & Receiver</p>
            <p>Balsa, Styrofoam, Sun pack & Sun board</p>
            <p>Aeroplane RC Parts</p>
            <p>Connector & Accessories</p>
          </div>
        </div>
        <div className="sidebar-section">
          <h4 onClick={() => toggleSection("3D")}>
            3D Printer & Parts
            <span className="arrow">{openSection === "3D" ? "▲" : "▼"}</span>
          </h4>
          <div className={`dropdown ${openSection === "3D" ? "open" : ""}`}>
            <p>All 3D Printer & Parts</p>
            <p>3D Printer & Pen</p>
            <p>3D Printer Parts & Accessories</p>
            <p>Numakers FIlament</p>
            <p>Filaments</p>
          </div>
        </div>
        <div className="sidebar-section">
          <h4 onClick={() => toggleSection("Power")}>
            Power Supply and Batteries
            <span className="arrow">{openSection === "Power" ? "▲" : "▼"}</span>
          </h4>
          <div className={`dropdown ${openSection === "Power" ? "open" : ""}`}>
            <p>All Power Supply and Batteries</p>
            <p>SMPS & Adapter</p>
            <p>Solar Panel & Charge Controller</p>
            <p>Lithium-Ion Battery</p>
            <p>BMS</p>
            <p>Li-Po Battery & Charger</p>
            <p>BMS</p>
            <p>Non Rechargeable Battery</p>
            <p>Rechargeable Battery</p>
            <p>Battery Case / Holder</p>
            <p>Transformer</p>
          </div>
        </div>
        <div className="sidebar-section">
          <h4 onClick={() => toggleSection("Display")}>
            Display & LEDs
            <span className="arrow">{openSection === "Display" ? "▲" : "▼"}</span>
          </h4>
          <div className={`dropdown ${openSection === "Display" ? "open" : ""}`}>
            <p>All Display & LEDs</p>
            <p>LCD, TFT, E-INK Display</p>
            <p>7 Segment & Dot Matrix Display</p>
            <p>OLED Display</p>
            <p>LED</p>
          </div>
        </div>
        <div className="sidebar-section">
          <h4 onClick={() => toggleSection("Measuring")}>
            Measuring & Testing Instruments
            <span className="arrow">{openSection === "Measuring" ? "▲" : "▼"}</span>
          </h4>
          <div className={`dropdown ${openSection === "Measuring" ? "open" : ""}`}>
            <p>All Measuring & Testing Instruments</p>
            <p>Oscilloscope & Signal Generator</p>
            <p>Ammeter, Voltmeter & Multimeter</p>
            <p>Regulated Power Supply</p>
            <p>Measuring Instruments</p>
          </div>
        </div>
        <div className="sidebar-section">
          <h4 onClick={() => toggleSection("Professional")}>
            Professional Tools
            <span className="arrow">{openSection === "Professional" ? "▲" : "▼"}</span>
          </h4>
          <div className={`dropdown ${openSection === "Professional" ? "open" : ""}`}>
            <p>All Professional Tools</p>
            <p>Soldering Tools</p>
            <p>Hand Tools</p>
            <p>Power Tools</p>
            <p>Drill Bits and Allen Key</p>
            <p>Glue Gun & Sticks</p>
          </div>
        </div>
        <div className="sidebar-section">
          <h4 onClick={() => toggleSection("DIY Kit")}>
            DIY Kit
            <span className="arrow">{openSection === "DIY Kit" ? "▲" : "▼"}</span>
          </h4>
          <div className={`dropdown ${openSection === "DIY Kit" ? "open" : ""}`}>
            <p>All DIY Kit</p>
            <p>Arduino, Sensor & IOT Kit</p>
            <p>Robot Kit</p>
            <p>Drone & Aeroplane Kit</p>
            <p>STEM Kit</p>
          </div>
        </div>
        <div className="sidebar-section">
          <h4 onClick={() => toggleSection("Collectibles")}>
            Books & Collectibles
            <span className="arrow">{openSection === "Collectibles" ? "▲" : "▼"}</span>
          </h4>
          <div className={`dropdown ${openSection === "Collectibles" ? "open" : ""}`}>
            <p>All Books & Collectibles</p>
            <p>Books </p>
            <p>Postcard</p>
            <p>Stamps</p>
            <p>SCoins</p>
          </div>
        </div>
        <div className="sidebar-section">
          <h4 onClick={() => toggleSection("Consumer")}>
            Consumer Electronics
            <span className="arrow">{openSection === "Consumer" ? "▲" : "▼"}</span>
          </h4>
          <div className={`dropdown ${openSection === "Consumer" ? "open" : ""}`}>
            <p>All Consumer Electronics</p>
            <p>Earphone & Speakers</p>
            <p>Keyboard & Mouse</p>
            <p>Webcam & Smartcam</p>
            <p>Charger, Cable & Accessories</p>
            <p>Laptop Stand & Cooling Pad</p>
          </div>
        </div>




      </div>
    </>
  );
};

export default Header;
