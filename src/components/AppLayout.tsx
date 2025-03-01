
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { Menu, Wallet, History, Trophy, MessageSquare, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/formatters";
import BetsterLogo from "./BetsterLogo";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const menuItems = [
    { label: "Profile", icon: User, path: "/profile" },
    { label: "Transaction History", icon: History, path: "/transactions" },
    { label: "Leaderboard", icon: Trophy, path: "/leaderboard" },
    { label: "Chat Support", icon: MessageSquare, path: "/support" },
    { label: "Game History", icon: History, path: "/game-history" },
  ];

  const handleLogout = () => {
    logout();
  };

  // Check if we're on a game screen to adjust layout
  const isGameScreen = location.pathname.includes("/game/");

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 w-full border-b backdrop-blur-lg bg-background/80 border-border/40">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <button className="rounded-full p-2 hover:bg-secondary flex items-center justify-center">
                  <Menu className="h-5 w-5 text-foreground" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-background/95 backdrop-blur-xl border-r border-border/40 p-0">
                <div className="flex flex-col h-full">
                  <div className="py-6 px-4 border-b border-border/40">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-betster-600 h-12 w-12 flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{user?.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(user?.wallet || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <nav className="px-2 py-4 flex flex-col gap-1">
                    {menuItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <item.icon className="h-5 w-5 text-betster-400" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary text-left text-destructive transition-colors mt-auto"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex-1 flex justify-center">
            <BetsterLogo className="h-8" />
          </div>

          <div className="flex items-center gap-2">
            <Sheet open={isDepositOpen} onOpenChange={setIsDepositOpen}>
              <SheetTrigger asChild>
                <button
                  className="inline-flex items-center gap-1.5 rounded-full bg-betster-600/20 px-3 py-1.5 text-sm font-medium text-betster-100 transition-colors hover:bg-betster-600/30"
                  onClick={() => setIsDepositOpen(true)}
                >
                  <Wallet className="h-4 w-4" />
                  <span>{formatCurrency(user?.wallet || 0)}</span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background/95 backdrop-blur-xl">
                <h3 className="text-lg font-semibold mb-4">Deposit Funds</h3>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Enter the amount you wish to deposit into your wallet.
                  </p>
                  <input
                    type="number"
                    placeholder="Amount in INR"
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                  <button className="betster-button w-full">Deposit</button>
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      className="text-sm text-betster-400 hover:text-betster-300"
                      onClick={() => {
                        setIsDepositOpen(false);
                        setIsWithdrawOpen(true);
                      }}
                    >
                      Switch to Withdrawal
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Sheet open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
              <SheetContent side="right" className="bg-background/95 backdrop-blur-xl">
                <h3 className="text-lg font-semibold mb-4">Withdraw Funds</h3>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Enter the amount you wish to withdraw from your wallet.
                  </p>
                  <input
                    type="number"
                    placeholder="Amount in INR"
                    className="w-full px-3 py-2 rounded-md border bg-background"
                  />
                  <button className="betster-button w-full">Withdraw</button>
                  
                  <div className="mt-4 flex justify-between">
                    <button
                      className="text-sm text-betster-400 hover:text-betster-300"
                      onClick={() => {
                        setIsWithdrawOpen(false);
                        setIsDepositOpen(true);
                      }}
                    >
                      Switch to Deposit
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn("flex-1 flex flex-col", isGameScreen ? "pb-0" : "pb-16")}>
        {children}
      </main>

      {/* Bottom Bar */}
      {!isGameScreen && (
        <footer className="fixed bottom-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-lg border-t border-border/40">
          <div className="flex h-16 items-center justify-between px-4">
            <Link
              to="/bet-history"
              className="flex flex-1 flex-col items-center justify-center py-1"
            >
              <History className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">Bet History</span>
            </Link>
            <Link
              to="/milestones"
              className="flex flex-1 flex-col items-center justify-center py-1"
            >
              <Trophy className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">Milestones</span>
            </Link>
            <Link
              to="/support"
              className="flex flex-1 flex-col items-center justify-center py-1"
            >
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">Support</span>
            </Link>
          </div>
        </footer>
      )}
    </div>
  );
};

export default AppLayout;
