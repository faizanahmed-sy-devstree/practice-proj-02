"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FilterIcon,
  SearchIcon,
  Delete02Icon,
  Cancel01Icon,
  GridIcon,
  ShoppingBag01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons"

export default function ShopPage() {
  const [price, setPrice] = React.useState([0, 2000])
  const [sort, setSort] = React.useState("featured")
  const [cats, setCats] = React.useState(["electronics", "home"])
  const [search, setSearch] = React.useState("")
  
  const allCats = ["electronics", "fashion", "home", "sports", "beauty", "accessories"]
  const products = [
    { id: 1, name: "Pro Studio Laptop", price: 1499, cat: "electronics", rating: 4.9, image: "💻" },
    { id: 2, name: "Ergonomic Desk Chair", price: 349, cat: "home", rating: 4.7, image: "🪑" },
    { id: 3, name: "Wireless Noise Cancelling", price: 299, cat: "electronics", rating: 4.8, image: "🎧" },
    { id: 4, name: "Performance Running Shoes", price: 140, cat: "sports", rating: 4.6, image: "👟" },
    { id: 5, name: "Minimalist Desk Lamp", price: 85, cat: "home", rating: 4.3, image: "💡" },
    { id: 6, name: "Mechanical Keyboard", price: 159, cat: "electronics", rating: 4.9, image: "⌨️" },
    { id: 7, name: "Leather Travel Bag", price: 220, cat: "fashion", rating: 4.5, image: "👜" },
    { id: 8, name: "Smart Fitness Tracker", price: 99, cat: "electronics", rating: 4.2, image: "⌚" },
  ]

  const filtered = products
    .filter(p => 
      cats.includes(p.cat) && 
      p.price >= price[0] && 
      p.price <= price[1] &&
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-low") return a.price - b.price
      if (sort === "price-high") return b.price - a.price
      if (sort === "rating") return b.rating - a.rating
      return 0
    })

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Product Catalog</h1>
            <p className="text-sm text-muted-foreground">Advanced filtering and sorting for e-commerce experiences.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <HugeiconsIcon icon={SearchIcon} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-9 h-9" 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button size="sm" className="gap-2">
              <HugeiconsIcon icon={ShoppingBag01Icon} size={16} />
              Cart (0)
            </Button>
          </div>
        </div>

        <div className="flex-1 flex gap-8 overflow-hidden">
          {/* Sidebar Filters */}
          <div className="w-72 flex flex-col gap-6 overflow-auto pr-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price Range</h3>
                <Badge variant="outline" className="font-mono text-[10px]">${price[0]} - ${price[1]}</Badge>
              </div>
              <Slider 
                value={price} 
                onValueChange={(v) => {
                  if (Array.isArray(v)) setPrice([...v]);
                }} 
                max={2000} 
                step={50} 
                className="py-4"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Categories</h3>
              <div className="grid grid-cols-1 gap-2">
                {allCats.map(c => (
                  <div key={c} className="flex items-center justify-between group cursor-pointer" onClick={() => setCats(prev => cats.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}>
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id={`cat-${c}`} 
                        checked={cats.includes(c)} 
                        onCheckedChange={() => {}} // Handled by div click
                      />
                      <label htmlFor={`cat-${c}`} className="text-sm capitalize cursor-pointer font-medium group-hover:text-primary transition-colors">{c}</label>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">{products.filter(p => p.cat === c).length}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-xs h-9 text-destructive hover:text-destructive hover:bg-destructive/5"
                onClick={() => { setCats([]); setPrice([0, 2000]); setSearch(""); }}
              >
                <HugeiconsIcon icon={Delete02Icon} size={14} className="mr-2" />
                Clear All Filters
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{filtered.length} Products found</span>
                <div className="flex gap-1 ml-4">
                  {cats.map(c => (
                    <Badge key={c} variant="secondary" className="h-6 gap-1 px-2 text-[10px] capitalize">
                      {c}
                      <button onClick={(e) => { e.stopPropagation(); setCats(prev => prev.filter(x => x !== c)) }}>
                        <HugeiconsIcon icon={Cancel01Icon} size={10} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Sort by:</span>
                <Select value={sort} onValueChange={(v) => v && setSort(v)}>
                  <SelectTrigger className="w-[160px] h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ScrollArea className="flex-1">
              {filtered.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-24 bg-muted/10 rounded-3xl border-2 border-dashed">
                  <HugeiconsIcon icon={FilterIcon} size={48} className="mb-4 opacity-20" />
                  <p className="text-lg font-bold">No products match your criteria</p>
                  <p className="text-sm">Try adjusting your filters or search term</p>
                  <Button variant="outline" className="mt-6" onClick={() => { setCats(allCats); setPrice([0, 2000]); setSearch(""); }}>Reset Everything</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                  {filtered.map((p) => (
                    <Card key={p.id} className="group overflow-hidden border-2 hover:border-primary/50 transition-all shadow-sm hover:shadow-xl">
                      <div className="aspect-square bg-muted/50 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                        {p.image}
                      </div>
                      <CardContent className="p-5 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{p.cat}</p>
                            <h3 className="text-sm font-bold leading-tight">{p.name}</h3>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded text-amber-600 text-[10px] font-bold">
                            <HugeiconsIcon icon={StarIcon} size={10} />
                            {p.rating}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-lg font-black">${p.price}</span>
                          <Button size="sm" className="h-8 px-4 text-xs rounded-full">Add to Cart</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
