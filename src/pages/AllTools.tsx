import React, { useState } from 'react';
import { TOOLS, CATEGORIES } from '../data/tools';
import { Search, Star, ArrowRight } from 'lucide-react';
import { useCustomTheme } from '../context/CustomThemeContext';

interface AllToolsProps {
  onNavigate: (page: string) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
}

export const AllTools: React.FC<AllToolsProps> = ({
  onNavigate,
  favorites,
  onToggleFavorite,
}) => {
  const { effectiveColors, config } = useCustomTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTools = TOOLS.filter((tool) => {
    const matchesSearch =
      !searchQuery ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-150">
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b"
        style={{ borderColor: effectiveColors.borderColor }}
      >
        <div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{ color: effectiveColors.textMain }}
          >
            All Online Utilities ({TOOLS.length} Tools)
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: effectiveColors.textSecondary }}>
            Free client-side image editing, passport studio, PDF, document, and biodata tools.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tools by name, tag..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border focus:outline-none focus:ring-2"
            style={{
              backgroundColor: effectiveColors.surfaceBg,
              borderColor: effectiveColors.borderColor,
              color: effectiveColors.textMain,
            }}
          />
        </div>
      </div>

      {/* Category Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                isSelected ? 'text-white shadow-xs' : 'hover:border-indigo-400'
              }`}
              style={
                isSelected
                  ? {
                      backgroundColor: effectiveColors.primary,
                      borderColor: effectiveColors.primary,
                    }
                  : {
                      backgroundColor: effectiveColors.surfaceBg,
                      borderColor: effectiveColors.borderColor,
                      color: effectiveColors.textSecondary,
                    }
              }
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => {
            const isFav = favorites.includes(tool.id);
            return (
              <div
                key={tool.id}
                onClick={() => onNavigate(`tool:${tool.slug}`)}
                className="group p-5 border hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                style={{
                  backgroundColor: effectiveColors.surfaceBg,
                  borderColor: effectiveColors.borderColor,
                  borderRadius: config.radius === 'small' ? '8px' : config.radius === 'large' ? '20px' : '14px',
                }}
              >
                <div>
                  <div className="flex items-start justify-between mb-2.5">
                    <span
                      className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${effectiveColors.primary}15`,
                        color: effectiveColors.primary,
                      }}
                    >
                      {tool.category.replace('-', ' ')}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(tool.id);
                      }}
                      className="p-1 text-slate-400 hover:text-amber-500 cursor-pointer"
                      title="Save to favorites"
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  <h3
                    className="font-bold text-sm transition-colors"
                    style={{ color: effectiveColors.textMain }}
                  >
                    {tool.name}
                  </h3>
                  <p
                    className="text-xs mt-1.5 line-clamp-2 leading-relaxed"
                    style={{ color: effectiveColors.textSecondary }}
                  >
                    {tool.description}
                  </p>
                </div>

                <div
                  className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-semibold"
                  style={{
                    borderColor: effectiveColors.borderColor,
                    color: effectiveColors.linkColor,
                  }}
                >
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="py-16 text-center rounded-2xl border p-8"
          style={{
            backgroundColor: effectiveColors.surfaceBg,
            borderColor: effectiveColors.borderColor,
          }}
        >
          <p className="text-sm" style={{ color: effectiveColors.textSecondary }}>
            No tools found matching &quot;{searchQuery}&quot;.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 text-xs font-semibold hover:underline cursor-pointer"
            style={{ color: effectiveColors.linkColor }}
          >
            Reset Search & Filters
          </button>
        </div>
      )}
    </div>
  );
};
