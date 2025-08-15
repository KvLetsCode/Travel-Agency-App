import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseMarkdownToJson } from "lib/utils";
import { data, type ActionFunctionArgs} from "react-router";
import { appwriteConfig, database } from "~/appwrite/client";
import { ID } from "appwrite";

export const action = async ({ request }: ActionFunctionArgs) => { 
    const {
        country,
        duration,
        travelStyles,
        interest,
        budget,
        groupType
        

    } = await request.json()

    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY!)
    const unsplashApikey = process.env.VITE_UNSPLASH_ACCESS_KEY

    try {
        const prompt = `Generate a ${duration}-day travel itinerary for ${country} based on the following user information:
        Budget: '${budget}'
        Interests: '${interest}'
        TravelStyle: '${travelStyles}'
        GroupType: '${groupType}'
        Return the itinerary and lowest estimated price in a clean, non-markdown JSON format with the following structure:
        {
        "name": "A descriptive title for the trip",
        "description": "A brief description of the trip and its highlights not exceeding 100 words",
        "estimatedPrice": "Lowest average price for the trip in USD, e.g.$price",
        "duration": ${duration},
        "budget": "${budget}",
        "travelStyle": "${travelStyles}",
        "country": "${country}",
        "interests": ${interest},
        "groupType": "${groupType}",
        "bestTimeToVisit": [
        '🌸 Season (from month to month): reason to visit',
        '☀️ Season (from month to month): reason to visit',
        '🍁 Season (from month to month): reason to visit',
        '❄️ Season (from month to month): reason to visit'
        ],
        "weatherInfo": [
        '☀️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
        '🌦️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
        '🌧️ Season: temperature range in Celsius (temperature range in Fahrenheit)',
        '❄️ Season: temperature range in Celsius (temperature range in Fahrenheit)'
        ],
        "location": {
        "city": "name of the city or region",
        "coordinates": [latitude, longitude],
        "openStreetMap": "link to open street map"
        },
        "itinerary": [
        {
        "day": 1,
        "location": "City/Region Name",
        "activities": [
            {"time": "Morning", "description": "🏰 Visit the local historic castle and enjoy a scenic walk"},
            {"time": "Afternoon", "description": "🖼️ Explore a famous art museum with a guided tour"},
            {"time": "Evening", "description": "🍷 Dine at a rooftop restaurant with local wine"}
        ]
    },
    ...
    ]
    }`;
        
        const textResult = await genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }).generateContent([prompt])
        
        const trip = parseMarkdownToJson(textResult.response.text())

        const imageResponse = await fetch(`https://api.unsplash.com/search/photos?query=${country} ${interest} ${travelStyles}&client_id=${unsplashApikey}`)

        const imageUrls = (await imageResponse.json()).results.slice(0,3).map((result:any) => result.urls?.regular || null)

        const result = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.tripCollectionId,
            ID.unique(),
            {
                tripDetail: JSON.stringify(trip),
                createdAt : new Date().toISOString(),
                imageUrls
            }
        )

        return data({id:result.$id})
    } catch (e) {
        console.error('Error generating travel plan',e)
    }
} 