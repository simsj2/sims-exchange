import sims from './SC.png';
import eth from './ETH.png';
import './App.css';
import React from 'react';
import { useState, useEffect } from 'react';

// Sets the exhange rate and passes the BuyForm input as a prop
function BuyForm({childToParentBuy}) {
    const [BuyInput, setBuyInput] = useState("");
    const [BuyOutput, setBuyOutput] = useState("")
    const buyRate = 100;

    return(
        <div>
            <div className="FormCard">
                <form>
                    <img src={eth} className="FormLogo" />
                    <label>
                        <input type="text" placeholder="Amount of GoerliETH" className="Form" onChange={(event)=>{
                            {/* Takes the input and displays the calculated output */}
                            setBuyInput(event.target.value)
                            setBuyOutput(event.target.value * buyRate)
                            childToParentBuy(event.target.value)
                            }}/>  
                    </label>
                    <span> </span>
                </form> 
                {'\u21F5'}
                <div>
                    <img src={sims} className="FormLogo" />
                    <label>
                         <input value={BuyOutput} placeholder="Amount of SimsCoin" className="Form" />
                    </label>
                    <span> </span> 
                </div>
            </div>
        </div>
    );
}

export default BuyForm;