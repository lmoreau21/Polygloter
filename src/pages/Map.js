import React, { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import { scaleLinear, scaleQuantize } from "d3-scale";
import { Tooltip } from "@chakra-ui/react";
import worldAtlas from "world-atlas/countries-110m.json";
//import countryCodes from '../countries.json';
const mapLanguagesKey = {
    'English': {
        'United States of America': 82.1, 'Pakistan': 46, 'United Kingdom': 97.3, 'India': 3.2, 'Nigeria': 15, 'Canada': 58.7, 'Australia': 76.8, 'Ghana': 23, 'South Africa': 9.6, 'Ireland': 98.4, 'New Zealand': 72.6, 'Philippines': 2.9, 'Trinidad and Tobago': 93.5, 'Chile': 5.2, 'Afghanistan': 2, 'United Arab Emirates': 7, 'Panama': 13.4, 'Cameroon': 2, 'Malaysia': 1.6, 'Sierra Leone': 4.7, 'Zimbabwe': 2.2, 'Zambia': 1.7, 'Puerto Rico': 5.5, 'Bahamas': 42, 'Liberia': 2.5, 'Honduras': 1.2, 'Japan': 0.1, 'Namibia': 3.4, 'Botswana': 2.1, 'Cyprus': 4.1, 'Norway': 0.5, 'Brunei': 4.3, 'Denmark': 0.3, 'Guatemala': 0.1, 'Belize': 3.9, 'Rwanda': 0.1, 'Burundi': 0.1, 'Vanuatu': 2,
    },
    'Mandarin Chinese': {
        'China': 91, 'Taiwan': 87.5, 'Thailand': 12.3, 'United States of America': 0.9, 'Malaysia': 7.4, 'Philippines': 2, 'Vietnam': 1.4, 'Australia': 2.8, 'Cambodia': 3.1, 'Canada': 1.2, 'Japan': 0.2, 'New Zealand': 2.2, 'South Korea': 0.1, 'Brunei': 9.3, 'North Korea': 0.1, 'Costa Rica': 0.2,
    },
    'Spanish': {
        'Mexico': 90, 'Colombia': 99, 'Argentina': 96.8, 'United States of America': 10.7, 'Spain': 74, 'Peru': 84.1, 'Venezuela': 96.9, 'Chile': 89.7, 'Ecuador': 93, 'Guatemala': 69.9, 'Cuba': 100, 'Dominican Republic': 98, 'Honduras': 94.4, 'Bolivia': 60.7, 'Nicaragua': 95.3, 'El Salvador': 96, 'Costa Rica': 97.5, 'Paraguay': 55.1, 'Uruguay': 95.7, 'Panama': 69.2, 'Puerto Rico': 94.3, 'Equatorial Guinea': 61.6, 'Canada': 1.3, 'France': 0.4, 'Belize': 46, 'Switzerland': 1.1, 'Sweden': 0.6,
    },
    'Hindi': {
        'India': 41, 'Fiji': 43.7, 'United Arab Emirates': 3, 'New Zealand': 1.6, 'Jamaica': 1.9, 'Trinidad and Tobago': 3.4,
    },
    'Bengali': {
        'Bangladesh': 97.7, 'India': 8.1, 'Saudi Arabia': 4.1, 'United Arab Emirates': 1,
    },
    'Portuguese': {
        'Brazil': 93.2, 'Angola': 36.6, 'Portugal': 99, 'Mozambique': 10.7, 'France': 1.2, 'United States of America': 0.2, 'Canada': 0.7, 'Guinea-Bissau': 8.1, 'Paraguay': 2.2, 'Switzerland': 1.2, 'Luxembourg': 13, 'Equatorial Guinea': 1.2,
    },
    'Russian': {
        'Russia': 82, 'Ukraine': 32.9, 'Belarus': 70.2, 'Uzbekistan': 14.2, 'Kazakhstan': 19, 'Germany': 3.6, 'Israel': 14, 'Turkmenistan': 12, 'Tajikistan': 7, 'United States of America': 0.2, 'Latvia': 33.8, 'Kyrgyzstan': 9, 'Estonia': 27.6, 'Georgia': 8.8, 'Azerbaijan': 2.4, 'Moldova': 9.4, 'Lithuania': 6.4, 'Canada': 0.4, 'Armenia': 2, 'Finland': 0.9, 'Cyprus': 2.5,
    },
    'Japanese': {
        'Japan': 99.1, 'United States of America': 0.2, 'Brazil': 0.2,
    },
    'Turkish': {
        'Turkey': 87.6, 'Germany': 2.6, 'Bulgaria': 8.2, 'France': 0.4, 'Austria': 2.3, 'Netherlands': 0.8, 'Greece': 0.9, 'North Macedonia': 3.5, 'Denmark': 0.8, 'Kosovo': 1.1, 'Cyprus': 0.2,
    },
    'Korean': {
        'South Korea': 99.9, 'North Korea': 99.9, 'China': 0.1, 'United States of America': 0.3, 'Japan': 0.5,
    },
    'French': {
        'France': 93.6, 'Canada': 22, 'Haiti': 42, 'Belgium': 41.1, 'Democratic Republic of the Congo': 4.3, 'United States of America': 0.7, 'Switzerland': 21.3, 'Mali': 6.4, 'Cameroon': 3, 'Madagascar': 2.3, 'Togo': 7.2, 'Ivory Coast': 2.1, 'Central African Republic': 7.5, 'Chad': 2.3, 'Burkina Faso': 1.3, 'Italy': 0.5, 'Guinea': 2.1, 'Niger': 1.1, 'Republic of the Congo': 4.6, 'Senegal': 1.4, 'Benin': 0.8, 'Gabon': 4, 'New Caledonia': 34.3, 'New Zealand': 1.2, 'Equatorial Guinea': 2.4, 'Burundi': 0.3, 'Luxembourg': 4.2, 'Djibouti': 1.8, 'Rwanda': 0.1, 'Vanuatu': 0.6,
    },
    'German': {
        'Germany': 90.1, 'Austria': 88.6, 'Switzerland': 62.5, 'Russia': 1.5, 'United States of America': 0.6, 'Brazil': 0.5, 'Kazakhstan': 3.1, 'Canada': 1.3, 'Poland': 1.3, 'Italy': 0.5, 'Belgium': 0.7, 'Romania': 0.4, 'Hungary': 0.7, 'Paraguay': 0.9, 'Czech Republic': 0.5, 'Denmark': 0.5, 'Namibia': 0.9, 'Belize': 3.1,
    },
    'Vietnamese': {
        'Vietnam': 86.8, 'Cambodia': 5.5, 'United States of America': 0.2, 'Australia': 1.1,
    },
    'Italian': {
        'Italy': 94.1, 'United States of America': 0.6, 'Argentina': 1.7, 'Switzerland': 8.3, 'Brazil': 0.3, 'Germany': 0.7, 'Canada': 1.3, 'Australia': 1.4, 'France': 0.4, 'Belgium': 2.1, 'Luxembourg': 4.6, 'Slovenia': 1.1, 'Croatia': 0.5,
    },
    'Polish': {
        'Poland': 97.6, 'United States of America': 0.3, 'Canada': 0.7, 'Germany': 0.3, 'Lithuania': 5.6, 'Czech Republic': 0.6, 'Belarus': 0.6, 'Ukraine': 0.1, 'Latvia': 1.8,
    },
    'Ukrainian': {
        'Ukraine': 64.7, 'Russia': 1.3, 'Kazakhstan': 5, 'Canada': 0.6, 'Poland': 0.6, 'Moldova': 7.2, 'Belarus': 1.3, 'Romania': 0.4, 'Latvia': 2.2, 'Estonia': 0.6,
    },
    'Dutch': {
        'Netherlands': 95.6, 'Belgium': 54.2, 'Canada': 0.5,
    },
    'Arabic': {
        'Egypt': 98.8, 'Algeria': 86, 'Iraq': 77.2, 'Yemen': 99.6, 'Saudi Arabia': 88, 'Morocco': 65, 'Sudan': 49.4, 'Syria': 90, 'Jordan': 97.9, 'Tunisia': 69.9, 'Libya': 96, 'Lebanon': 93, 'Palestine': 95.9, 'United Arab Emirates': 42, 'Oman': 76.7, 'Kuwait': 78.1, 'Chad': 12.3, 'Iran': 2, 'Israel': 18, 'France': 2.5, 'Turkey': 1.4, 'Qatar': 40.7, 'Canada': 1.1, 'Afghanistan': 1, 'Australia': 1.3, 'Netherlands': 0.9, 'Djibouti': 10.6, 'Sweden': 0.8, 'Honduras': 0.4, 'Denmark': 0.7, 'Cyprus': 1.2,
    },
    'Thai': {
        'Thailand': 52.6, 'Vietnam': 1.6, 'Laos': 7.8,
    },
    'Greek': {
        'Greece': 97.4, 'Cyprus': 80.9, 'Germany': 0.4, 'Australia': 1.1, 'Albania': 1.8,
    },
    'Czech': {
        'Czech Republic': 81.2
    },
    'Swedish': {
        'Sweden': 89.5, 'Finland': 5.5, 'Denmark': 0.3, 'Norway': 0.3,
    },
    'Finnish': {
        'Finland': 93.2, 'Sweden': 2.4, 'Estonia': 0.7,
    },
    'Danish': {
        'Denmark': 93.5, 'Norway': 0.4, 'Greenland': 11,
    },
    'Norwegian': {
        'Norway': 96.6, 'Sweden': 0.5, 'Denmark': 0.3,
    },
    'Hungarian': {
        'Hungary': 84.6, 'Romania': 6.3, 'Slovakia': 10.5, 'Serbia': 3.4, 'Ukraine': 0.3, 'Czech Republic': 0.2, 'Slovenia': 0.9, 'Croatia': 0.2,
    },
    'Hebrew': {
        'Israel': 63.1, 'Palestine': 4.1,
    },
    'Indonesian': {
        'Indonesia': 39.4
    },
    'Romanian': {
        'Romania': 85.4, 'Moldova': 73.9, 'Ukraine': 0.7, 'Hungary': 1, 'Cyprus': 2.9,
    }
};
const MapChart = ({ language = 'English' }) => {
    const languageData = mapLanguagesKey[language];
 
    // Define a color scale
    const colorScale = scaleLinear()
        .domain([0, 100])
        .range([
            "#f0ddd8",
            "#7f3623"
        ]);

    return (
        <div style={{ overflow:'hidden'}}>
        <ComposableMap data-tip=""  width='650' height='400' projectionConfig={{ scale:150}}>
            <Geographies geography={worldAtlas}>
                {({ geographies }) =>
                    geographies.map(geo => {
                        //const countryTemp = (countryCodes.find(countryCur => countryCur.name === geo.properties.name)).code;
                        const countryCode = geo.properties.name;
            
                        const percent = languageData[countryCode];
                        const color = percent ? colorScale(percent) : "#fff";


                        return (
                            <Tooltip
                                key={geo.rsmKey}
                                label={percent ? `${geo.properties.name}: ${percent}% native speakers` : geo.properties.NAME}
                            >
                                <Geography
                                    geography={geo}
                                    fill={color}
                                    stroke="#ccc"
                                    style={{
                                        default: { outline: "none" },
                                        hover: { fill: "#465181", outline: "none" },
                                        pressed: { outline: "none" },
                                    }}
                                />
                            </Tooltip>
                        );
                    })
                }
            </Geographies>
        </ComposableMap></div>
    );
};

export default memo(MapChart);