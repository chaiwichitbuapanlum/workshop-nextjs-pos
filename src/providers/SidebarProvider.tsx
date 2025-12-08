'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

/**
 * โครงสร้างข้อมูลที่เปิดเผยให้คอมโพเนนต์อื่นใช้สำหรับจัดการสถานะ Sidebar
 */
interface SidebarProviderType {
    isSidebarOpen: boolean
    toggleSidebar: () => void
}

/**
 * React context สำหรับเก็บสถานะเปิด/ปิดของ Sidebar และฟังก์ชันสลับสถานะ
 */
const SidebarContext = createContext<SidebarProviderType | undefined>(undefined)

/**
 * ตัวห่อ (Provider) ที่กระจายสถานะ Sidebar ให้คอมโพเนนต์ลูกผ่าน `useSidebar`
 *
 * @param children คอมโพเนนต์ลูกที่ต้องการเข้าถึง context
 */
export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    /**
     * สลับสถานะ Sidebar เปิด/ปิด
     */
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    )
}

/**
 * Hook สำหรับอ่านและแก้ไขสถานะ Sidebar
 *
 * @throws Error หากเรียกใช้ภายนอก `SidebarProvider`
 */
export const useSidebar = () => {
    const context = useContext(SidebarContext)
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider')
    }
    return context
}
