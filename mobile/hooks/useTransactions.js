import { useCallback, useState } from "react";
import { Alert } from "react-native";


//api base URL
const api_URL = process.env.EXPO_PUBLIC_API_URL + "/api"

export const useTranscation = (userId) => {
    const [transaction, setTranscation] = useState ([]);
    const [summary, setSummary] = useState ({
        balance : 0,
        income  : 0,
        expense : 0,
    });

    const [isLoading, setIsLoading] = useState(true)


    // used for the performance reason 
    const fetchTranscation = useCallback(
        async () => {
        try {
            const result = await fetch(`${api_URL}/transactions/${userId}`)
            const data = await result.json()
            console.log("transaction", data)
            setTranscation (data)
        } catch (error) {
            console.error("Error Fetching Data")
            
        }
    }, [userId]
    )
    
    const fetchSummary = useCallback(
        async () => {
        try {
            const result = await fetch(`${api_URL}/transactions/summary/${userId}`)
            const data = await result.json()
            console.log("Summary", data)
            setSummary (data)
        } catch (error) {
            console.error("Error Fetching Data")
            
        }
    }, [userId]



    )


    const loadData = useCallback (async () => {
        if (!userId) return
        setIsLoading (true);
        try {
            await Promise.all ([fetchSummary(), fetchTranscation()])
          
        } catch (error) {
            console.log("Eroor Loading Data", error)
            
            
        } finally {
            setIsLoading (false)
        }
    }, [fetchTranscation,fetchSummary, userId ]


    
    )


    const deleteTranscation = async (id) => {
try {
    const result = await fetch(`${api_URL}/transactions/${id}`, {method : "DELETE" })
    if(!result.ok) throw new Error ("Failed to delete Transcation")

        // to refresh data after deletion
        loadData()
        Alert.alert("Sucess", "Transcation Deleted sucessfully")
    
} catch (error) {
    console.error("Error deleting Transcation ", error)
    Alert.alert ("Error", error.message)
    
}


    }
    return {transaction, summary, isLoading, loadData, deleteTranscation }
}