import Header from "../components/ui/header";
import { FlickeringGrid } from "../components/ui/flickering-grid";
import MatrixBackground from "../components/ui/matrix-background";
import { LayoutProvider, useLayout } from "./LayoutContext";
import { usePage } from "@inertiajs/react";
import Direction from "@/components/ui/direction";
export default function AppLayout ({title, children}){
    return(
    <LayoutProvider>
      <Shell>{children}</Shell>
    </LayoutProvider>
    )
}
function Shell({ children }) {
  const { sharedValue, routes } = useLayout();
  const { component, url } = usePage();
  const hideHeaderComponents = [
    "DatabaseDown",
    'ResetPassword'
  ];

  const hideHeaderUrls = [
    "/login",
    "/register",
    '/verify-otp',
    '/forgot-password',
    "/quiz",
  ];

    const shouldHideHeader =
        hideHeaderComponents.includes(component) ||
        hideHeaderUrls.includes(url);

  const urlCheck = routes.includes(url)
  return (
    <div className="fixed inset-0 overflow-y-auto bg-green-700 w-full h-dvh flex flex-col bg-cover">
            {
              !shouldHideHeader&&
              (
              <>
                <Direction/>
                <Header/>
              </>
            )
            }
            <MatrixBackground active={sharedValue}/>
            <FlickeringGrid
                className="absolute inset-0 -z-10"
                squareSize={5}
                gridGap={10}
                flickerChance={0.3}
                color="rgb(255, 255 , 0)"
                maxOpacity={0.2}
            />
            <main className="h-dvh bg-gradient-to-t from-green-700/25 via-black/80 to-green-900/25">
                {children}
            </main>
        </div>
  );
}