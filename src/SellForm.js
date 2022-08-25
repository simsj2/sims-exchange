import sims from './SC.png';
import eth from './ETH.png';
import './App.css';
import React from 'react';
import { useState, useEffect } from 'react';

// Sets the exhange rate and passes the SellForm input as a prop
function SellForm({childToParentSell}) {
    const [SellInput, setSellInput] = useState("");
    const [SellOutput, setSellOutput] = useState("")
    const sellRate = 100;

    return(
        <div>
            <div className="FormCard">
                <form>
                    <img src={sims} className="FormLogo" />
                    <label>
                        <input type="text" placeholder="Amount of SimsCoin" className="Form" onChange={(event)=>{
                            {/* Takes the input and displays the calculated output */}
                            setSellInput(event.target.value)
                            setSellOutput(event.target.value / sellRate)
                            childToParentSell(event.target.value)
                            }}/>  
                    </label>
                    <span></span>
                </form> 
                {'\u21F5'}
                <div>
                    <img src={eth} className="FormLogo" />
                    <label>
                         <input value={SellOutput} placeholder="Amount of GoerliETH" className="Form" />
                    </label>
                    <span> </span> 
                </div>
            </div>
        </div>
    );
}

export default SellForm;