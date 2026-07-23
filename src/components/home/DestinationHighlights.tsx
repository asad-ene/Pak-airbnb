// DestinationHighlights.tsx
// Editorial section spotlighting what makes Naran, Hunza & Skardu worth visiting.
// Pulls from the shared destinationImages source in lib/destinationImages.ts
import { MapPin } from "lucide-react";
import { destinationImages } from "@/lib/destinationImages";

interface Attraction {
  name: string;
  description: string;
}

interface Spotlight {
  key: "naran" | "hunza" | "skardu";
  name: string;
  tagline: string;
  intro: string;
  attractions: Attraction[];
  images: string[]; // 3 images used for the collage
}

const spotlights: Spotlight[] = [
  {
    key: "naran",
    name: "Naran",
    tagline: "Kaghan Valley, Khyber Pakhtunkhwa",
    intro:
      "Tucked into the Kaghan Valley at over 8,000 feet, Naran is where turquoise lakes sit beneath jagged, snow-streaked peaks. Summer brings alpine meadows into full bloom and rivers swollen with glacial melt — a landscape that shifts from pine forest to bare rock within a single afternoon's drive.",
    attractions: [
      { name: "Lake Saif-ul-Malook", description: "A glacial lake ringed by 5,000m peaks, said to shift color through the day." },
      { name: "Lulusar Lake", description: "A still, high-altitude lake that feeds the Kunhar River." },
      { name: "Babusar Pass", description: "A 13,000-foot pass with sweeping views toward Chilas and the Karakoram." },
      { name: "Shogran & Siri Paye", description: "Rolling alpine meadows reached by chairlift, popular for camping." },
    ],
    images: [
      destinationImages.naran[0],
      destinationImages.naran[2],
      destinationImages.naran[3],
    ],
  },
  {
    key: "hunza",
    name: "Hunza",
    tagline: "Gilgit-Baltistan, Karakoram Range",
    intro:
      "Hunza trades Naran's drama for scale — terraced orchards and stone villages perched above the Karakoram Highway, with some of the tallest peaks on Earth visible from the valley floor. Spring turns the valley pink and white with apricot and cherry blossom; by autumn, the same trees glow gold.",
    attractions: [
      { name: "Attabad Lake", description: "A striking turquoise lake formed by a 2010 landslide, now a boating hotspot." },
      { name: "Rakaposhi Viewpoint", description: "Unobstructed views of the 7,788m Rakaposhi peak." },
      { name: "Baltit & Altit Forts", description: "Centuries-old forts overlooking Karimabad." },
      { name: "Passu Cones & Glacier", description: "Cathedral-like peaks beside one of Pakistan's most accessible glaciers." },
    ],
    images: [
      destinationImages.hunza[0],
      destinationImages.hunza[1],
      destinationImages.hunza[2],
    ],
  },
  {
    key: "skardu",
    name: "Skardu",
    tagline: "Gilgit-Baltistan, gateway to the Karakoram",
    intro:
      "Skardu is the gateway to the world's highest mountains — the last major town before the road climbs toward K2 and the Baltoro Glacier. Between expeditions, its own desert valleys, glacial lakes, and Balti forts are reason enough to visit on their own.",
    attractions: [
      { name: "Shangrila Resort", description: "Built around Lower Kachura Lake, its still waters mirror the peaks above." },
      { name: "Deosai National Park", description: "Vast alpine plains above 4,000m, home to brown bears and summer wildflowers." },
      { name: "Shigar Fort", description: "A restored 17th-century fort, now a heritage guesthouse." },
      { name: "Satpara Lake", description: "A glacial lake framed by cold desert mountains just outside town." },
    ],
    images: [
      destinationImages.skardu[0],
      destinationImages.skardu[1],
      destinationImages.skardu[2],
    ],
  },
];

export function DestinationHighlights() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-[#10b981]">Where to go</p>
          <h2 className="mt-2 font-[family-name:var(--font-plus-jakarta)] text-3xl font-bold tracking-tight text-[#222] sm:text-4xl">
            The beauty behind every stay
          </h2>
          <p className="mt-3 text-base text-[#717171] sm:text-lg">
            Each destination on PakStays has its own landscape, its own pace,
            and its own reasons to visit. Here&apos;s what makes Naran, Hunza,
            and Skardu worth the trip.
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-20 sm:gap-28">
          {spotlights.map((spot, i) => (
            <div
              key={spot.key}
              className={`flex flex-col items-center gap-10 lg:gap-16 ${
                i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              {/* Image collage */}
              <div className="grid h-[340px] w-full max-w-md grid-cols-2 grid-rows-2 gap-3 sm:h-[400px] sm:max-w-lg lg:h-[440px] lg:w-1/2 lg:max-w-none">
                <div className="col-span-1 row-span-2 overflow-hidden rounded-3xl shadow-md">
                  <img
                    src={spot.images[0]}
                    alt={`${spot.name} landscape`}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-3xl shadow-md">
                  <img
                    src={spot.images[1]}
                    alt={`${spot.name} scenery`}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-3xl shadow-md">
                  <img
                    src={spot.images[2]}
                    alt={`${spot.name} view`}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="w-full lg:w-1/2">
                <p className="text-xs font-medium uppercase tracking-widest text-[#10b981]">
                  {spot.tagline}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold text-[#222] sm:text-3xl">
                  {spot.name}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#717171] sm:text-base">
                  {spot.intro}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {spot.attractions.map((a) => (
                    <div key={a.name} className="flex gap-2.5">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#10b981]" />
                      <div>
                        <p className="text-sm font-semibold text-[#222]">
                          {a.name}
                        </p>
                        <p className="text-xs leading-relaxed text-[#717171]">
                          {a.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
