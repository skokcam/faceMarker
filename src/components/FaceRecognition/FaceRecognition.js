import React from 'react';
import './FaceRecognition.css';

const BoxList = ( {boxes} ) => {
  const boxArray = boxes.map( (box, i) => {
    return(<div className='bounding-box' 
    key ={i.toString()} 
    style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}>      
    </div>);
  });
  return(boxArray);
}

const FaceRecognition = ({ imageUrl, boxes }) => {
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputimage' alt='' src={imageUrl} width='500px' heigh='auto'/>
        <BoxList boxes={boxes}/>        
      </div>
    </div>
  );
}

export default FaceRecognition;