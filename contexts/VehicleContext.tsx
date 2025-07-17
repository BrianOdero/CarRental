// context/VehicleContext.tsx
import { vehicleData } from "@/types/types"
import { createContext, useContext, useState } from "react"
 // create and reuse your type definition

type VehicleContextType = {
  vehicles: vehicleData[]
  setVehicles: React.Dispatch<React.SetStateAction<vehicleData[]>>
}

const VehicleContext = createContext<VehicleContextType>({
  vehicles: [],
  setVehicles: () => {},
})



export const VehicleProvider = ({ children }: { children: React.ReactNode }) => {
  const [vehicles, setVehicles] = useState<vehicleData[]>([])

  return (
    <VehicleContext.Provider value={{ vehicles, setVehicles }}>
      {children}
    </VehicleContext.Provider>
  )
}

export const useVehicleContext = () => useContext(VehicleContext)
