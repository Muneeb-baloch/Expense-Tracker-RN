import { useTranscation } from "@/hooks/useTransactions";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useAuth();

const {transaction, summary, isLoading, loadData, deleteTranscation } = useTranscation (user.id) 

useEffect(() =>{
  loadData()

}, [loadData])
console.log(user.id)

console.log("transaction", transaction)
console.log("Summary", summary)


  return (
    <View>
      <Text>Welcome!</Text>
      <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      <Pressable onPress={() => signOut()}>
        <Text>Sign out</Text>
      </Pressable>
    </View>
  );
}
