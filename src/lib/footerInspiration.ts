export type InspirationLink = {
  name: string;
  category: string;
};

export type InspirationTab = {
  id: string;
  label: string;
  items: InspirationLink[];
};

/**
 * Placeholder content, grouped the way the homepage footer displays it.
 * Once real destination/listing data exists, this can be generated from
 * that instead of hardcoded here — same shape (id, label, items).
 */
export const INSPIRATION_TABS: InspirationTab[] = [
  {
    id: "popular",
    label: "Popular",
    items: [
      { name: "Hunza", category: "Cottage rentals" },
      { name: "Skardu", category: "Guest house rentals" },
      { name: "Naran", category: "Cabin rentals" },
      { name: "Gilgit", category: "House rentals" },
      { name: "Fairy Meadows", category: "Camping stays" },
      { name: "Chitral", category: "Valley rentals" },
      { name: "Kaghan", category: "Cottage rentals" },
      { name: "Murree", category: "Apartment rentals" },
      { name: "Neelum Valley", category: "Guest house rentals" },
      { name: "Attabad Lake", category: "Lakeview stays" },
      { name: "Shogran", category: "Cabin rentals" },
      { name: "Deosai", category: "Camping stays" },
      { name: "Khaplu", category: "Homestays" },
      { name: "Passu", category: "Cottage rentals" },
      { name: "Karimabad", category: "Apartment rentals" },
      { name: "Astore", category: "Guest house rentals" },
      { name: "Ghizer", category: "Homestays" },
      { name: "Babusar", category: "Mountain stays" },
      { name: "Ratti Gali", category: "Trek lodges" },
      { name: "Swat Valley", category: "Valley rentals" },
    ],
  },
  {
    id: "mountains",
    label: "Mountains",
    items: [
      { name: "Nanga Parbat", category: "Basecamp lodges" },
      { name: "K2 Base Camp", category: "Trekker stays" },
      { name: "Rakaposhi Viewpoint", category: "Mountain lodges" },
      { name: "Passu Cones", category: "Cottage rentals" },
      { name: "Shimshal", category: "Homestays" },
      { name: "Concordia", category: "Trek lodges" },
      { name: "Ratti Gali", category: "Trek lodges" },
      { name: "Deosai Plains", category: "Camping stays" },
      { name: "Khunjerab Pass", category: "Mountain stays" },
      { name: "Broghil Valley", category: "Homestays" },
      { name: "Chapursan Valley", category: "Homestays" },
      { name: "Yasin Valley", category: "Guest house rentals" },
      { name: "Naltar Valley", category: "Cabin rentals" },
      { name: "Fairy Meadows", category: "Camping stays" },
      { name: "Rupal Valley", category: "Trek lodges" },
      { name: "Ultar Meadows", category: "Mountain lodges" },
      { name: "Diamir Face", category: "Basecamp lodges" },
      { name: "Minimarg", category: "Homestays" },
      { name: "Astore Valley", category: "Guest house rentals" },
      { name: "Babusar Top", category: "Mountain stays" },
    ],
  },
  {
    id: "lakes",
    label: "Lakes & valleys",
    items: [
      { name: "Attabad Lake", category: "Lakeview stays" },
      { name: "Saif ul Malook", category: "Vacation rentals" },
      { name: "Rush Lake", category: "Trek lodges" },
      { name: "Borith Lake", category: "Guest house rentals" },
      { name: "Satpara Lake", category: "Cottage rentals" },
      { name: "Khaplu Valley", category: "Homestays" },
      { name: "Ghizer Valley", category: "Homestays" },
      { name: "Neelum Valley", category: "Guest house rentals" },
      { name: "Kaghan Valley", category: "Cottage rentals" },
      { name: "Hunza Valley", category: "Apartment rentals" },
      { name: "Shigar Valley", category: "Guest house rentals" },
      { name: "Basho Valley", category: "Cabin rentals" },
      { name: "Phander Valley", category: "Lakeview stays" },
      { name: "Kachura Lake", category: "Lakeview stays" },
      { name: "Sheosar Lake", category: "Camping stays" },
      { name: "Ansoo Lake", category: "Trek lodges" },
      { name: "Katora Lake", category: "Camping stays" },
      { name: "Baltoro", category: "Trek lodges" },
      { name: "Karambar Lake", category: "Homestays" },
      { name: "Ghanche", category: "Cottage rentals" },
    ],
  },
  {
    id: "outdoors",
    label: "Outdoors & trekking",
    items: [
      { name: "Fairy Meadows Trek", category: "Guided treks" },
      { name: "K2 Base Camp Trek", category: "Guided treks" },
      { name: "Rush Lake Trek", category: "Day hikes" },
      { name: "Deosai Jeep Safari", category: "Day trips" },
      { name: "Hunza River Rafting", category: "Adventure tours" },
      { name: "Naltar Skiing", category: "Winter sports" },
      { name: "Ratti Gali Trek", category: "Day hikes" },
      { name: "Nanga Parbat Circuit", category: "Guided treks" },
      { name: "Kaghan Trout Fishing", category: "Local experiences" },
      { name: "Shimshal Trek", category: "Multi-day treks" },
      { name: "Concordia Trek", category: "Multi-day treks" },
      { name: "Passu Glacier Walk", category: "Day hikes" },
      { name: "Chapursan Camping", category: "Camping trips" },
      { name: "Khunjerab Wildlife Safari", category: "Day trips" },
      { name: "Broghil Trek", category: "Multi-day treks" },
      { name: "Astore Valley Hike", category: "Day hikes" },
      { name: "Babusar Pass Drive", category: "Scenic drives" },
      { name: "Swat Paragliding", category: "Adventure tours" },
      { name: "Naran Horse Trek", category: "Day hikes" },
      { name: "Yasin Valley Trek", category: "Multi-day treks" },
    ],
  },
];
