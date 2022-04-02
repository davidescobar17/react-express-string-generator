import './App.css';

import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import TextareaAutosize from 'react-textarea-autosize';

import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';

function App() {

  const [charactersText, setCharactersText] = useState('');
  const [termsText, setTermsText] = useState('');
  const [showCopiedIcon, setShowCopiedIcon] = useState(false);

  const rules = ['Letters', '0-9', 'Special Characters', 'Specify (characters)', 'Specify (terms)']

  const ruleStrings = ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', '0123456789',
    ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~', '(User specified)', '(User specified)'];

  const [rulePositionConfigs, setRulePositionConfigs] = useState(
    [
      {ruleIndex: 0, countMin: 1, countMax: 8, isRange: true},
      {ruleIndex: 1, countMin: 1, countMax: 8, isRange: true},
    ]
  );

  const [result, setResult] = useState('');

  const onSelectRule = (e, index, rulePositionConfigIndex) => {

    e.preventDefault();
    
    let updatedState = [...rulePositionConfigs];

    updatedState[rulePositionConfigIndex].ruleIndex = index;
    setRulePositionConfigs(updatedState);
  }

  const generateTerms = (length) => {

    let result = '';
    let terms = termsText.split(/\s*[\s,]\s*/);
    let termsLength = terms.length;

    for ( var i = 0; i < length; i++ ) {
        result += terms[(Math.floor(Math.random() * 
        termsLength))];
    }

    return result;
  }

  const generateCharacters = (characters, length) => {

    let result = '';
    let charactersLength = characters.length;

    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
      charactersLength));
    }

    return result;
  }

  const addNewRule = (e) => {

    e.preventDefault();

    setRulePositionConfigs(prev =>
      [...prev, {ruleIndex: 0, countMin: 1, countMax: 8, isRange: true}])
  }

  const deleteThisRule = (e, rulePositionConfigIndex) => {

    e.preventDefault();

    setRulePositionConfigs(
      prev => prev.filter((_, i) => i !== rulePositionConfigIndex)
    );
  }

  // set the height of the add new rule button to match the height of rules

  const setAddNewRuleHeight = (e) => {

    const height = document.getElementById('ruleDiv')?.clientHeight;
    
    document.getElementById('addNewRuleDiv').style.minHeight = `${height}px`;
  }

  useEffect(() => {
    
    setAddNewRuleHeight()
  }, []);

  const randomIntFromInterval = (min, max) => {
    
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const generateString = (e) => {

    e.preventDefault();

    let result = '';

    // go through rules, each rule appends to the result string

    for (const rulePositionConfig of rulePositionConfigs) {

      if (rulePositionConfig.isRange) {

        let countMin = rulePositionConfig.countMin;
        let countMax = rulePositionConfig.countMax;
        let allowGenerate = true;

        if (countMin === '' && countMax === '') {

          allowGenerate = false;
        }
        else if (countMin === '') {

          countMin = countMax;
        }
        else if (countMax === '') {

          countMax = countMin;
        }

        if (allowGenerate) {

          if (rulePositionConfig.ruleIndex === 3) {
            
            // take input text for characters
            result += generateCharacters(charactersText,
              randomIntFromInterval(rulePositionConfig.countMin, rulePositionConfig.countMax));
          }
          else if (rulePositionConfig.ruleIndex === 4) {
            
            // take input text for terms
            result += generateTerms(
              randomIntFromInterval(rulePositionConfig.countMin, rulePositionConfig.countMax));
          }
          else {

            // read from preset rules
            result += generateCharacters(ruleStrings[rulePositionConfig.ruleIndex],
              randomIntFromInterval(rulePositionConfig.countMin, rulePositionConfig.countMax));
          }
        }
      }
      else {

        let countMin = rulePositionConfig.countMin;

        if (countMin === '') {

          countMin = 1;
        }

        if (rulePositionConfig.ruleIndex === 3) {
            
          result += generateCharacters(charactersText, countMin);
        }
        else if (rulePositionConfig.ruleIndex === 4) {
          
          result += generateTerms(countMin);
        }
        else {

          result += generateCharacters(ruleStrings[rulePositionConfig.ruleIndex], countMin);
        }
      }
    }

    setResult(result);
  }

  const handleMinInput = (e, rulePositionConfigIndex, maxValue) => {
    
    let value = e.target.value;

    // handle edge cases for min count
    if (value < 0) {

      value = 0;
    }
    else if (value > maxValue) {

      value = maxValue;
    }

    let updatedState = [...rulePositionConfigs];

    updatedState[rulePositionConfigIndex].countMin = value;
    setRulePositionConfigs(updatedState);
  }

  const handleMaxInput = (e, rulePositionConfigIndex, minValue) => {

    let value = e.target.value;

    // handle edge cases for max count
    if (value > 10) {

      value = 10;
    }
    else if (value === '') {

      value = '';
    }
    else if (value < minValue) {

      value = minValue;
    }

    let updatedState = [...rulePositionConfigs];

    updatedState[rulePositionConfigIndex].countMax = value;
    setRulePositionConfigs(updatedState);
  }

  const handleRadioPress = (e, rulePositionConfigIndex) => {

    let updatedState = [...rulePositionConfigs];

    updatedState[rulePositionConfigIndex].isRange = e.target.name.includes('isRange');
    setRulePositionConfigs(updatedState);
  }

  const RuleDropdown = (props) => {

    return(

      <Dropdown className="DropdownContainer">
        <Dropdown.Toggle className="DropdownContent" variant="success" id="dropdown-basic">
          {rules[props.rulePositionConfig.ruleIndex]}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {
            rules.map(
              (rule, ruleIndex) =>
                <Dropdown.Item key={ruleIndex}
                  onClick={(e) => onSelectRule(e, ruleIndex, props.rulePositionConfigIndex)}>
                  {rule}
                </Dropdown.Item>
            )
          }
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  return (
  <div className="App">

    <header className="Header">
      String Generator
    </header>

    <div className="MainContent">

      <p className="Message">
        Set rules to generate a randomised string
      </p>

      <div className="RulesContainer">
        {
          rulePositionConfigs.map(
            (rulePositionConfig, rulePositionConfigIndex) =>

            <div id={'ruleDiv'} className="Rule" key={'rulePositionConfigIndex' + rulePositionConfigIndex}>

              <div className="IconButton">
                <IconButton aria-label="delete"
                  onClick={(e) => {deleteThisRule(e, rulePositionConfigIndex)}} startIcon={<DeleteIcon />}
                  color="error">
                  <DeleteIcon/>
                </IconButton>
              </div>

              <div className="RuleConfigContainer" key={rulePositionConfigIndex}>

                <div className="RuleConfig">

                  <RuleDropdown rulePositionConfigIndex={rulePositionConfigIndex}
                    rulePositionConfig={rulePositionConfig}/>

                  {
                    rulePositionConfig.ruleIndex === 3 ?

                    <TextareaAutosize className="TextAreaAutoSize" type="text" value={charactersText}
                      onChange={(event) => setCharactersText(event.target.value)}
                      placeholder={'e.g. abc123!@#'}/>

                    :

                    null
                  }

                  {
                    rulePositionConfig.ruleIndex === 4 ?

                    <TextareaAutosize className="TextAreaAutoSize" type="text" value={termsText}
                      onChange={(event) => setTermsText(event.target.value)}
                      placeholder={'e.g. abc 123 !@#'}/>

                    :

                    null
                  }

                  <div className="RangeInputContainer">

                    <div className="RangeInputRadioContainer">
                      <input className="RadioSpecific form-check-input" type="radio" 
                        value={!rulePositionConfig.isRange} checked={!rulePositionConfig.isRange}
                        onChange={(e) => handleRadioPress(e, rulePositionConfigIndex)}
                        name={'isSet-' + rulePositionConfigIndex}/>
                        
                        Specific

                      <input className="RadioRange form-check-input" type="radio"
                        value={rulePositionConfig.isRange} checked={rulePositionConfig.isRange}
                        onChange={(e) => handleRadioPress(e, rulePositionConfigIndex)}
                        name={'isRange-' + rulePositionConfigIndex}/> 
                        
                        Range
                    </div>

                    {
                      rulePositionConfig.isRange?

                      <div className="RangeInputNumberContainer">
                        <label className="RangeMinLabel">Min</label>
                        <input className="RangeMinInput"
                          placeholder={rulePositionConfig.countMin === ''? rulePositionConfig.countMax: rulePositionConfig.countMin}
                          value={rulePositionConfig.countMin} type="text"
                          onChange={(e) => handleMinInput(e, rulePositionConfigIndex, rulePositionConfig.countMax)}/>

                        <label className="RangeMaxLabel">Max</label>
                        <input className="RangeMaxInput"
                          placeholder={rulePositionConfig.countMax === '' ? rulePositionConfig.countMin: rulePositionConfig.countMax}
                          value={rulePositionConfig.countMax} type="text"
                          onChange={(e) => handleMaxInput(e, rulePositionConfigIndex, rulePositionConfig.countMin)}/>
                      </div>

                      :

                      <div className="SpecificInputContainer">
                        <input className="SpecificInput"
                          placeholder={rulePositionConfig.countMin === '' ? 1: rulePositionConfig.countMin}
                          value={rulePositionConfig.countMin} type="text"
                          onChange={(e) => handleMinInput(e, rulePositionConfigIndex, rulePositionConfig.countMax)}/>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          )
        }

        <div id={'addNewRuleDiv'} className="NewRuleDiv">
          <Button color="primary" className="NewRuleButton" variant="contained"
            onClick={(e) => {addNewRule(e)}} startIcon={<AddIcon />}
            sx={{backgroundColor: 'rgba(0,0,0,0.2)', textTransform: 'none', borderRadius: '0px',
              '&:hover': {background: '#282c34', zIndex: 1, boxShadow: '0 3px 10px rgb(0 0 0 / 0.6)'}}}>
            New rule
          </Button>
        </div>
      </div>

      <div className="GenerateStringContainer">

        <Button variant="contained" color="success"
          onClick={(e) => {e.target.blur(); generateString(e)}} size={'large'}
          sx={{textTransform: 'none', marginRight: '5px', backgroundColor: '#198754', 
            '&:hover': {background: '#157347'}}}>
          Generate
        </Button>

        {
          result !== '' ?

          <IconButton color={showCopiedIcon? "success":"primary"}
            aria-label="copy generated text to clipboard"
            onClick={() => {navigator.clipboard.writeText(result);
              setShowCopiedIcon((prev) => true);
              setTimeout(() => {setShowCopiedIcon(false)}, 3000)}}>
            
            {
              showCopiedIcon?
              <DoneIcon />
              
              :

              <ContentCopyIcon />
            }
          </IconButton>

          :

          null
        }
      </div>

      {
        result !== ''?
        
        <div>
          <p className="GeneratedStringLabel">
            Your generated string is
          </p>

          <p className="GeneratedString">
            {result}
          </p>
        </div>

        :

        null
      }
    </div>

    <div className="Footer fixed-bottom">
      <a href="https://github.com/davidescobar17" className="link-light">GitHub</a>
    </div>
  </div>
  );
}

export default App;