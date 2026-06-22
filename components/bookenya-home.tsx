"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Hotel,
  MapPin,
  Minus,
  Phone,
  Plus,
  Search,
  Star,
  Users,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  formatMoney,
  properties,
  type Property
} from "@/lib/properties";
import { submitLead } from "@/lib/supabase/leads";

type SearchFilters = {
  location: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
};

type LeadForm = {
  name: string;
  phone: string;
  email: string;
};

const initialFilters: SearchFilters = {
  location: "",
  checkIn: "",
  checkOut: "",
  adults: 2,
  children: 0,
  rooms: 1
};

const officialSupportPhone = "+447401146290";
const whatsappPhone = officialSupportPhone.replace(/\D/g, "");

export function BookenyaHome() {
  const [draftFilters, setDraftFilters] =
    useState<SearchFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<SearchFilters>(initialFilters);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [imageIndexes, setImageIndexes] = useState<Record<string, number>>({});
  const [leadForm, setLeadForm] = useState<LeadForm>({
    name: "",
    phone: "",
    email: ""
  });
  const [leadStatus, setLeadStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const totalGuests = draftFilters.adults + draftFilters.children;

  const filteredProperties = useMemo(() => {
    const location = appliedFilters.location.trim().toLowerCase();
    const requestedGuests = appliedFilters.adults + appliedFilters.children;

    return properties.filter((property) => {
      const locationMatches =
        !location ||
        property.location.toLowerCase().includes(location) ||
        property.area.toLowerCase().includes(location) ||
        property.name.toLowerCase().includes(location);
      const guestsMatch = property.guests >= requestedGuests;
      const roomsMatch = property.rooms >= appliedFilters.rooms;

      return locationMatches && guestsMatch && roomsMatch;
    });
  }, [appliedFilters]);

  const bookingSummary = selectedProperty
    ? buildBookingSummary(selectedProperty, appliedFilters)
    : "";

  const whatsappHref = selectedProperty
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
        `Hello Bookenya, I would like to book ${bookingSummary}.`
      )}`
    : "#";

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedFilters(draftFilters);
    setIsGuestsOpen(false);
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
  }

  function updateGuestCount(
    key: "adults" | "children" | "rooms",
    direction: "increase" | "decrease"
  ) {
    setDraftFilters((current) => {
      const minimum = key === "adults" || key === "rooms" ? 1 : 0;
      const nextValue =
        direction === "increase" ? current[key] + 1 : current[key] - 1;

      return {
        ...current,
        [key]: Math.max(minimum, nextValue)
      };
    });
  }

  function moveImage(property: Property, direction: "next" | "previous") {
    setImageIndexes((current) => {
      const currentIndex = current[property.id] ?? 0;
      const nextIndex =
        direction === "next"
          ? (currentIndex + 1) % property.images.length
          : (currentIndex - 1 + property.images.length) %
            property.images.length;

      return { ...current, [property.id]: nextIndex };
    });
  }

  async function onLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedProperty) {
      return;
    }

    setLeadStatus("submitting");
    const result = await submitLead({
      ...leadForm,
      propertyId: selectedProperty.id,
      propertyName: selectedProperty.name,
      checkIn: appliedFilters.checkIn,
      checkOut: appliedFilters.checkOut,
      adults: appliedFilters.adults,
      children: appliedFilters.children,
      rooms: appliedFilters.rooms
    });

    setLeadStatus(result.ok ? "success" : "error");

    if (result.ok) {
      setLeadForm({ name: "", phone: "", email: "" });
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="bg-primary text-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <a className="text-2xl font-black tracking-tight" href="#">
            Bookenya
          </a>
          <div className="hidden items-center gap-6 text-sm font-semibold md:flex">
            <a href="#listings">Stays</a>
            <a href="/about">About</a>
            <a href="/contact">Contact support</a>
            <a href="/terms">Terms</a>
          </div>
          <Button
            className="border-white/40 bg-white text-primary hover:bg-white/90"
            variant="outline"
          >
            List your property
          </Button>
        </nav>

        <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:pb-28">
          <div className="max-w-3xl">
            <Badge className="mb-5 bg-white text-primary hover:bg-white">
              Curated Kenya stays with human booking support
            </Badge>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Find your next hotel, apartment, or safari stay in minutes.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/85">
              Browse handpicked properties, compare prices, and send booking
              details directly to our support team by WhatsApp, phone, or quick
              inquiry.
            </p>
          </div>
        </section>
      </header>

      <section className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={onSearch}
          className="grid gap-2 rounded-2xl border-4 border-[#febb02] bg-[#febb02] shadow-booking lg:grid-cols-[1.25fr_1.1fr_0.9fr_auto]"
        >
          <label className="flex min-h-20 items-center gap-3 rounded-xl bg-white px-4">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="sr-only">Where are you going?</span>
            <Input
              className="border-0 px-0 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Where are you going?"
              value={draftFilters.location}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  location: event.target.value
                }))
              }
            />
          </label>

          <div className="grid min-h-20 gap-2 rounded-xl bg-white p-3 sm:grid-cols-2">
            <label className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <span className="sr-only">Check-in date</span>
              <Input
                type="date"
                value={draftFilters.checkIn}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    checkIn: event.target.value
                  }))
                }
              />
            </label>
            <label>
              <span className="sr-only">Check-out date</span>
              <Input
                type="date"
                value={draftFilters.checkOut}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    checkOut: event.target.value
                  }))
                }
              />
            </label>
          </div>

          <div className="relative">
            <button
              className="flex min-h-20 w-full items-center gap-3 rounded-xl bg-white px-4 text-left"
              type="button"
              onClick={() => setIsGuestsOpen((open) => !open)}
            >
              <Users className="h-5 w-5 text-primary" />
              <span>
                <span className="block text-sm font-semibold">
                  Guests / Rooms
                </span>
                <span className="text-sm text-muted-foreground">
                  {totalGuests} guests, {draftFilters.rooms} room
                  {draftFilters.rooms > 1 ? "s" : ""}
                </span>
              </span>
            </button>
            {isGuestsOpen ? (
              <Card className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20">
                <CardContent className="space-y-4 p-4">
                  {[
                    ["adults", "Adults"],
                    ["children", "Children"],
                    ["rooms", "Rooms"]
                  ].map(([key, label]) => (
                    <div
                      className="flex items-center justify-between"
                      key={key}
                    >
                      <span className="font-medium">{label}</span>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() =>
                            updateGuestCount(
                              key as "adults" | "children" | "rooms",
                              "decrease"
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center font-semibold">
                          {draftFilters[key as keyof SearchFilters]}
                        </span>
                        <Button
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() =>
                            updateGuestCount(
                              key as "adults" | "children" | "rooms",
                              "increase"
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </div>

          <Button className="min-h-20 text-lg" size="lg" type="submit">
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
        </form>
      </section>

      <section
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
        id="listings"
      >
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-semibold text-primary">
              {filteredProperties.length} stays available
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              Curated places guests love
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Professional listings with manual confirmation, perfect for a
              market-ready MVP before live payment automation.
            </p>
          </div>
          <Badge variant="outline">
            <Star className="mr-1 h-3.5 w-3.5 fill-primary text-primary" />
            High-quality local inventory
          </Badge>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProperties.map((property) => {
              const imageIndex = imageIndexes[property.id] ?? 0;

              return (
                <Card className="overflow-hidden" key={property.id}>
                  <div className="relative h-56 overflow-hidden bg-muted">
                    <img
                      alt={property.name}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      src={property.images[imageIndex]}
                    />
                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <Badge>{property.category}</Badge>
                    </div>
                    <button
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 rounded-full bg-white/90 p-2 text-slate-900 shadow"
                      onClick={() => moveImage(property, "previous")}
                      type="button"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 rounded-full bg-white/90 p-2 text-slate-900 shadow"
                      onClick={() => moveImage(property, "next")}
                      type="button"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <CardContent className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold">{property.name}</h3>
                        <p className="mt-1 flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-4 w-4" />
                          {property.location}
                        </p>
                      </div>
                      <div className="rounded-lg bg-primary px-2.5 py-2 text-center text-white">
                        <p className="text-sm font-black">{property.rating}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {property.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {property.amenities.slice(0, 3).map((amenity) => (
                        <Badge key={amenity} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-end justify-between gap-4 border-t pt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Starting from
                        </p>
                        <p className="text-xl font-black">
                          {formatMoney(
                            property.pricePerNight,
                            property.currency
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          per night
                        </p>
                      </div>
                      <Button onClick={() => setSelectedProperty(property)}>
                        View details / book
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Hotel className="mx-auto h-10 w-10 text-primary" />
              <h3 className="mt-4 text-xl font-bold">
                No matching stays yet
              </h3>
              <p className="mt-2 text-muted-foreground">
                Try a broader location, fewer guests, or fewer rooms.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="border-t bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ["Manual booking", "Every request is routed to a human support team."],
            ["Local expertise", "Curated hotels, apartments, and lodges across Kenya."],
            ["MVP ready", "Designed for lead capture before payment automation."]
          ].map(([title, text]) => (
            <Card key={title}>
              <CardContent>
                <h3 className="font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="bg-slate-950 px-4 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/70">
            Bookenya facilitates manual booking inquiries and support-led
            confirmations.
          </p>
          <div className="flex gap-4 text-sm font-semibold">
            <a href="/about">About Us</a>
            <a href="/contact">Contact Support</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </footer>

      {selectedProperty ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <Card className="max-h-[92vh] w-full max-w-3xl overflow-y-auto">
            <CardContent className="p-0">
              <div className="relative h-64 overflow-hidden rounded-t-xl">
                <img
                  alt={selectedProperty.name}
                  className="h-full w-full object-cover"
                  src={selectedProperty.images[0]}
                />
                <button
                  aria-label="Close booking overlay"
                  className="absolute right-4 top-4 rounded-full bg-white p-2 shadow"
                  onClick={() => {
                    setSelectedProperty(null);
                    setLeadStatus("idle");
                  }}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid gap-6 p-6 lg:grid-cols-[1fr_0.9fr]">
                <div>
                  <Badge className="mb-3">{selectedProperty.ratingLabel}</Badge>
                  <h2 className="text-2xl font-black">
                    {selectedProperty.name}
                  </h2>
                  <p className="mt-2 flex items-center text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    {selectedProperty.location}
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {selectedProperty.description}
                  </p>
                  <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm">
                    <p className="font-semibold">Booking request summary</p>
                    <p className="mt-1 text-muted-foreground">
                      {bookingSummary}
                    </p>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <a
                      className={cn(
                        buttonVariants({ variant: "whatsapp", size: "lg" }),
                        "w-full"
                      )}
                      href={whatsappHref}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Chat on WhatsApp
                    </a>
                    <a
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "w-full"
                      )}
                      href={`tel:${officialSupportPhone}`}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Support
                    </a>
                  </div>
                </div>

                <form className="space-y-3" onSubmit={onLeadSubmit}>
                  <div>
                    <h3 className="text-lg font-bold">Quick inquiry</h3>
                    <p className="text-sm text-muted-foreground">
                      Leave your details and support will confirm availability.
                    </p>
                  </div>
                  <Input
                    placeholder="Full name"
                    required
                    value={leadForm.name}
                    onChange={(event) =>
                      setLeadForm((current) => ({
                        ...current,
                        name: event.target.value
                      }))
                    }
                  />
                  <Input
                    placeholder="Phone number"
                    required
                    type="tel"
                    value={leadForm.phone}
                    onChange={(event) =>
                      setLeadForm((current) => ({
                        ...current,
                        phone: event.target.value
                      }))
                    }
                  />
                  <Input
                    placeholder="Email address"
                    required
                    type="email"
                    value={leadForm.email}
                    onChange={(event) =>
                      setLeadForm((current) => ({
                        ...current,
                        email: event.target.value
                      }))
                    }
                  />
                  <Button
                    className="w-full"
                    disabled={leadStatus === "submitting"}
                    size="lg"
                    type="submit"
                  >
                    {leadStatus === "submitting"
                      ? "Sending..."
                      : "Send inquiry"}
                  </Button>
                  {leadStatus === "success" ? (
                    <p className="rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
                      Inquiry captured. Supabase will receive this once env
                      variables are configured.
                    </p>
                  ) : null}
                  {leadStatus === "error" ? (
                    <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">
                      We could not submit the inquiry. Please try WhatsApp or
                      call support.
                    </p>
                  ) : null}
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </main>
  );
}

function buildBookingSummary(property: Property, filters: SearchFilters) {
  const dates =
    filters.checkIn && filters.checkOut
      ? `${filters.checkIn} to ${filters.checkOut}`
      : "dates to be confirmed";
  const guestText = `${filters.adults} adult${filters.adults > 1 ? "s" : ""}${
    filters.children ? `, ${filters.children} child${filters.children > 1 ? "ren" : ""}` : ""
  }`;

  return `${property.name}, ${dates}, ${guestText}, ${filters.rooms} room${
    filters.rooms > 1 ? "s" : ""
  }`;
}
