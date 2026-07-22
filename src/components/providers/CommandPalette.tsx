'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from 'cmdk'
import { GitFork, Moon, Sparkles, Sun, ArrowRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import type { Provider } from '@/lib/providers/types'
import { NAV_LINKS, GITHUB_REPO_URL } from '@/lib/content/navigation'
import { useScrollToSection } from '@/components/motion/useScrollToSection'
import { useJumpToConsole } from '@/components/motion/useJumpToConsole'
import { useProviderSelection } from './ProviderSelectionContext'

interface CommandPaletteProps {
  providers: Provider[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Cmd+K / Ctrl+K power-user shortcut: jump to any section or straight to a
 * specific provider's form without touching the mouse. This is the same
 * pattern developer tools like Linear and Raycast use — for an audience of
 * developers, it is one of the highest-leverage friction cuts available.
 */
export function CommandPalette({ providers, open, onOpenChange }: CommandPaletteProps) {
  const { theme, setTheme } = useTheme()
  const scrollToSection = useScrollToSection()
  const jumpToConsole = useJumpToConsole()
  const { selectProvider } = useProviderSelection()

  const sortedProviders = useMemo(
    () => [...providers].sort((a, b) => a.name.localeCompare(b.name)),
    [providers]
  )

  const runAndClose = (action: () => void) => {
    action()
    onOpenChange(false)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      contentClassName="animate-fade-in fixed left-1/2 top-[12vh] z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-zinc-900/10 bg-white text-zinc-900 shadow-2xl dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50"
      overlayClassName="fixed inset-0 z-50 bg-zinc-950/50 backdrop-blur-sm dark:bg-black/70"
    >
      <div className="flex items-center gap-2 border-b border-zinc-900/10 px-3 dark:border-white/10">
        <CommandInput
          placeholder="Jump to a section, or select a provider…"
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
        />
        <kbd className="hidden shrink-0 rounded border border-zinc-900/10 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 sm:inline-block dark:border-white/10 dark:text-zinc-500">
          esc
        </kbd>
      </div>

      <CommandList className="max-h-80 overflow-y-auto p-2">
        <CommandEmpty className="px-3 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          No matches. Try a section name or a provider.
        </CommandEmpty>

        <CommandGroup
          heading="Navigate"
          className="px-2 py-1.5 [&_[cmdk-group-heading]]:px-0.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-zinc-400 dark:[&_[cmdk-group-heading]]:text-zinc-500 [&_[cmdk-group-items]]:mt-1"
        >
          {NAV_LINKS.map((link) => (
            <CommandItem
              key={link.sectionId}
              value={`nav-${link.label}`}
              onSelect={() => runAndClose(() => scrollToSection(link.sectionId))}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm text-zinc-700 aria-selected:bg-accent-500/10 aria-selected:text-accent-600 dark:text-zinc-300 dark:aria-selected:text-accent-300"
            >
              <ArrowRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
              {link.label}
            </CommandItem>
          ))}
          <CommandItem
            value="toggle-theme"
            onSelect={() => runAndClose(() => setTheme(theme === 'dark' ? 'light' : 'dark'))}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm text-zinc-700 aria-selected:bg-accent-500/10 aria-selected:text-accent-600 dark:text-zinc-300 dark:aria-selected:text-accent-300"
          >
            {theme === 'dark' ? (
              <Sun className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
            ) : (
              <Moon className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
            )}
            Toggle theme
          </CommandItem>
          <CommandItem
            value="view-source-github"
            onSelect={() =>
              runAndClose(() => window.open(GITHUB_REPO_URL, '_blank', 'noopener,noreferrer'))
            }
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm text-zinc-700 aria-selected:bg-accent-500/10 aria-selected:text-accent-600 dark:text-zinc-300 dark:aria-selected:text-accent-300"
          >
            <GitFork className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
            View source on GitHub
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className="my-1.5 h-px bg-zinc-900/10 dark:bg-white/10" />

        <CommandGroup
          heading="Providers"
          className="px-2 py-1.5 [&_[cmdk-group-heading]]:px-0.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-zinc-400 dark:[&_[cmdk-group-heading]]:text-zinc-500 [&_[cmdk-group-items]]:mt-1"
        >
          {sortedProviders.map((provider) => (
            <CommandItem
              key={provider.id}
              value={`${provider.name} ${provider.id} ${provider.tags?.join(' ') ?? ''}`}
              onSelect={() =>
                runAndClose(() => {
                  selectProvider(provider, { source: 'manual' })
                  jumpToConsole()
                })
              }
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm text-zinc-700 aria-selected:bg-accent-500/10 aria-selected:text-accent-600 dark:text-zinc-300 dark:aria-selected:text-accent-300"
            >
              <Sparkles className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
              {provider.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

/** Global Cmd+K / Ctrl+K listener — owns the palette's open state. */
export function useCommandPaletteShortcut() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return { open, setOpen }
}
