import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = React.forwardRef(({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
  const [internalActiveTab, setInternalActiveTab] = React.useState(defaultValue)
  const activeTab = value !== undefined ? value : internalActiveTab;
  const setActiveTab = onValueChange || setInternalActiveTab;

  return (
    <div
      ref={ref}
      className={cn("", className)}
      {...props}
    >
        {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { activeTab, setActiveTab });
            }
            return child;
        })}
    </div>
  )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef(({ className, activeTab, setActiveTab, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  >
      {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
              return React.cloneElement(child, { activeTab, setActiveTab });
          }
          return child;
      })}
  </div>
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, value, activeTab, setActiveTab, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    role="tab"
    onClick={() => setActiveTab && setActiveTab(value)}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      activeTab === value 
        ? "bg-background text-foreground shadow-sm" 
        : "hover:bg-background/50 hover:text-foreground",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, value, activeTab, ...props }, ref) => {
  if (value !== activeTab) return null;
  
  return (
    <div
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
