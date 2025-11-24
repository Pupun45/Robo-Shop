import React, { useState } from "react";
import "../App.css";
import Agreecalture from "../assets/Agreecalture.webp";
import IR from "../assets/IR_sensor_Module.webp";
import TH from "../assets/images.jpeg";
import Soil from "../assets/soil.jpg";
import LDR from "../assets/LDR.jpeg";
import banner from "../assets/project-banner.jpg"
import SoilMonitor from '../assets/SoilMonitor.jpg'
import smartFountain from '../assets/smart Fountain.jpg'
import SmartDustbin from '../assets/Smart Dustbin.png'
import HomeAutomation from '../assets/Home-Automation.jpg'
import Scrollbtn from '../Extra-Thing/ScrollButtons'
const projectData = [
  {
    id: 1,
    title: "Smart Agriculture System",
    image: Agreecalture,
    price: "799.00",
    oldPrice: "1299.00",
    description:
      "This IoT project helps monitor temperature, soil moisture, and light for farming. Automates irrigation and reduces water waste.",
    components: [
      { name: "Soil Moisture Sensor", image: Soil },
      { name: "DHT11 Sensor", image: TH },
      { name: "5mm LDR", image: LDR },
    ],
    suggestions: [
      { id: 2, name: "Home Automation System", price: "599", image: IR },
      { id: 3, name: "Weather Monitoring Station", price: "899", image: TH },
    ],
  },
  {
    id: 2,
    title: "Home Automation System",
    image: IR,
    price: "599.00",
    oldPrice: "899.00",
    description:
      "Control your lights and fans using a smartphone or voice command with this IoT home automation setup.",
    components: [
      { name: "IR Sensor", image: IR },
      { name: "Relay Module", image: {} },
    ],
    suggestions: [{ id: 1, name: "Smart Agriculture System", price: "799", image: {} }],
  },
];
//cards of project
const cardData = [
  { id: 1, name: "Home Automation", price: 8999, img: HomeAutomation },
  { id: 2, name:  "Smart Dustbin", price: 8999, img: SmartDustbin },
  { id: 3, name: "smart Fountain", price: 8999, img: smartFountain },
  { id: 4, name: "Soil Monitor", price: 8999, img: SoilMonitor },
  { id: 5, name: "Item 5", img: {} },
  { id: 6, name: "Item 6", img: {} },
  { id: 7, name: "Item 7", img: {} },
  { id: 8, name: "Item 8", img: {} },
  
];


export default function Project() {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };

  const handleBack = () => {
    setSelectedProject(null);
  };
  //cards crousel
   const [visibleCount, setVisibleCount] = useState(4);

  const loadMore = () => setVisibleCount(prev => prev + 4);

  return (
    <>
     <Scrollbtn/>
    <>
    <img src={banner} alt="banner-img" width={"100%"} height={"500px"}/>
    </>
     <div className="project-container">
      <div className="project-layout">
        <main className="project-main">
          {!selectedProject ? (
            <>
              <div className="project-grid">
                {projectData.map((project) => (
                  <div
                    key={project.id}
                    className="project-card"
                    onClick={() => handleSelectProject(project)}
                  >
                    <img src={project.image} alt={project.title} />
                    <h4>{project.title}</h4>
                    <p>Rs. {project.price}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <button onClick={handleBack} className="back-btn">
                ← Back to Projects
              </button>

              <div className="project-detail">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="project-main-image"
                />
                <div className="project-info">
                  <h2>{selectedProject.title}</h2>
                  <p className="project-description">{selectedProject.description}</p>
                  <div className="project-price">
                    <span className="old-price">Rs. {selectedProject.oldPrice}</span>
                    <span className="new-price">Rs. {selectedProject.price}</span>
                  </div>
                  <button className="buy-btn">Buy Now</button>

                  <div className="component-list">
                    <h3>Components Used</h3>
                    <div className="components-grid">
                      {selectedProject.components.map((comp, i) => (
                        <div key={i} className="component-card">
                          <img src={comp.image} alt={comp.name} />
                          <p>{comp.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="suggestions-section">
                    <h3>Suggested Projects</h3>
                    <div className="suggestions-grid">
                      {selectedProject.suggestions.map((sugg) => (
                        <div
                          key={sugg.id}
                          className="suggestion-card"
                          onClick={() =>
                            handleSelectProject(projectData.find((p) => p.id === sugg.id))
                          }
                        >
                          <img src={sugg.image} alt={sugg.name} />
                          <h4>{sugg.name}</h4>
                          <p>Rs. {sugg.price}</p>
                          <button className="view-btn">View Project</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        {/* Sidebar on Right */}
        <div className="project-layout">
        <aside className="project-sidebar">
          <h3>All Projects</h3>
          <ul className="project-list">
            {projectData.map((proj) => (
              <li
                key={proj.id}
                className={selectedProject?.id === proj.id ? "active-project" : ""}
                onClick={() => handleSelectProject(proj)}
              >
                
                {proj.title}
              </li>
            ))}
          </ul>
        </aside>
      </div>
      </div>
    </div>
     <>
        <div className="Text-size">
          <h3 className="hd" data-title=" Top Rated Project">
            Top Rated Project
          </h3>
          <div className="sep"></div>
          <div className="sep2"></div>
        </div>
      </>
      
    <div>
      <div className="pro-card-container">
        {cardData.slice(0, visibleCount).map((card) => (
          <div key={card.id} className="pro-card">
            <img src={card.img} alt={card.name} />
            <h4>{card.name}</h4>
             <p className="pro-price">₹{card.price}</p>
          </div>
        ))}
      </div>

      {visibleCount < cardData.length && (
        <button className="pro-load-btn" onClick={loadMore}>
          Load More
        </button>
      )}
    </div>

    </>
   
  );
}
