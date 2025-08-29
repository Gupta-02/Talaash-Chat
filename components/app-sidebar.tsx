import type * as React from "react";

import { SearchForm } from "@/components/search-form";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useChatStore } from "@/store/chat";
import { Button } from "@/components/ui/button";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    sessions,
    activeSessionId,
    createSession,
    switchSession,
    renameSession,
    deleteSession,
  } = useChatStore();

  // Defensive: find active session, fallback to first, fallback to undefined
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  return (
    <Sidebar {...props} variant="floating" className="!p-1.5">
      <SidebarHeader>
        <div className="flex justify-end items-center">
          <SidebarTrigger />
        </div>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <div className="flex flex-col gap-2">
          {sessions.map((session, idx) => (
            <div key={session.id} className={`flex items-center gap-2 transition-all duration-150 shadow-sm border ${activeSessionId === session.id ? 'bg-gradient-to-r from-green-200 via-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/30 border-emerald-400' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'} p-2 rounded-lg hover:scale-[1.03]`}>
              <span className="mr-2 text-lg">
                {session.icon || '💬'}
              </span>
              <Button
                variant={activeSessionId === session.id ? "default" : "ghost"}
                size="sm"
                className="font-semibold text-emerald-700 dark:text-emerald-300"
                onClick={() => switchSession(session.id)}
              >
                {session.name}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                onClick={() => renameSession(session.id, prompt('Rename session:', session.name) || session.name)}
                aria-label="Rename session"
              >
                📝
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-red-100 dark:hover:bg-red-900/30"
                onClick={() => deleteSession(session.id)}
                aria-label="Delete session"
              >
                🗑️
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="mt-2 border-emerald-400 text-emerald-700 dark:text-emerald-300" onClick={() => createSession(prompt('Session name:') || `Session ${sessions.length + 1}`)}>
            ➕ New Session
          </Button>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}