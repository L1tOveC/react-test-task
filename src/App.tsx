import React, { useCallback, useMemo, useState } from 'react'
import './App.css'
import Weather from './components/Weather'

const MoscowPosition = { lat: 55.751244, lon: 37.618423 }

const defaultVariablesList = [
    'weathercode', 'temperature_2m_max', 'temperature_2m_min', 'apparent_temperature_max',
    'apparent_temperature_min', 'sunrise', 'sunset', 'precipitation_sum', 'showers_sum',
    'precipitation_hours', 'windspeed_10m_max', 'windgusts_10m_max', 'winddirection_10m_dominant', 'shortwave_radiation_sum',
    'et0_fao_evapotranspiration'
]

const defaultUsedVariablesList = ['rain_sum', 'snowfall_sum']

function App() {
    const [variables, setVariables] = useState<string[]>(defaultUsedVariablesList)
    const [inputValue, setInputValue] = useState<string>('')
    const [availableVariables, setAvailableVariables] = useState<string[]>(defaultVariablesList)
    const [error, setError] = useState<string | null>(null) // Защита от дураков

    const handleAddVariable = useCallback(() => {
        if (!defaultVariablesList.includes(inputValue)) {
            setError('An invalid value was entered')
            setInputValue('')
            return
        }
        if (variables.includes(inputValue)){
            setError('The value has already been added')
            setInputValue('')
            return
        }
        setVariables(prevState => [...prevState, inputValue])
        setAvailableVariables(prevState => prevState.filter(variable => variable !== inputValue))
        setError(null)
        setInputValue('')
    }, [inputValue])

    // так удобнее
    const copyVariable = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
        }
        catch (err) {
            console.error("Error: ", err);
        }
    }, [])

    const variablesBlock = useMemo(() => {
        return (
          <div className='availableVariables'>
            {availableVariables.length ? (
                availableVariables.map(variable => (
                    <h3
                        className="variablesBlock"
                        onClick={() => copyVariable(variable)}
                        key={variable}
                    >
                        {variable}
                    </h3>
                ))
            ) : (
                <p>You have added all the variables!</p>
            )}
        </div>)
    }, [availableVariables, copyVariable])

    return (
        <>
            <div>
                <label>
                    <h2>Available variables (copy on click):</h2>
                    {variablesBlock}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        placeholder="Insert a variable"
                    />
                    <button
                        onClick={handleAddVariable}
                        disabled={!inputValue}
                    >
                        Add
                    </button>
                    <div style={{display: error && !inputValue ? 'block' : 'none', color: 'red'}}>{error}</div>
                </label>
            </div>

            <Weather lat={MoscowPosition.lat} long={MoscowPosition.lon} variables={variables}/>
        </>
    )
}

export default App
