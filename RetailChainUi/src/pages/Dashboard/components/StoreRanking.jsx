import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const StoreRanking = () => {
    return (
      <Card className="shadow-soft border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark flex flex-col">
        <CardHeader className="pb-6">
          <CardTitle className="text-base font-medium text-text-main dark:text-white tracking-wide">Top Performing Stores</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center gap-5 pt-0">
          {/* Store Item */}
          <div className="group cursor-pointer">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-text-main dark:text-white">New York Flagship</span>
              <span className="text-text-muted">$840k</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-2 rounded-full w-[90%] group-hover:bg-primary-dark transition-all duration-300"></div>
            </div>
          </div>
          {/* Store Item */}
          <div className="group cursor-pointer">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-text-main dark:text-white">London Central</span>
              <span className="text-text-muted">$720k</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-2 rounded-full w-[78%] group-hover:bg-primary-dark transition-all duration-300"></div>
            </div>
          </div>
          {/* Store Item */}
          <div className="group cursor-pointer">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-text-main dark:text-white">Tokyo Ginza</span>
              <span className="text-text-muted">$690k</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-2 rounded-full w-[74%] group-hover:bg-primary-dark transition-all duration-300"></div>
            </div>
          </div>
          {/* Store Item */}
          <div className="group cursor-pointer">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-text-main dark:text-white">Berlin Mitte</span>
              <span className="text-text-muted">$540k</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-2 rounded-full w-[60%] group-hover:bg-primary-dark transition-all duration-300"></div>
            </div>
          </div>
          {/* Store Item */}
          <div className="group cursor-pointer">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-text-main dark:text-white">Paris Marais</span>
              <span className="text-text-muted">$420k</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-2 rounded-full w-[45%] group-hover:bg-primary-dark transition-all duration-300"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  export default StoreRanking;
