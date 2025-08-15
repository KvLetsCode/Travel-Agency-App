import { useState } from "react";
import { useNavigate } from "react-router";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import {
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";

import { Header } from "components";
import { comboBoxItems, selectItems, travelStyles } from "~/constants";
import { world_map } from "~/constants/world_map";
import type { Route } from "./+types/create-trip";
import { account } from "~/appwrite/client";
import { cn, formatKey } from "lib/utils";

export const loader = async () => {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=flag,name,latlng,maps"
  );

  const data = await response.json();

  return data.map((country: any) => ({
    name: country.flag + country.name.common,
    coordinates: country.latlng,
    value: country.name.common,
    openStreetMap: country.maps?.openStreetMaps,
  }));
};

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
  const countries = loaderData as Country[];
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    country: countries[0]?.name || "",
    travelStyle: "",
    interest: "",
    budget: "",
    duration: 0,
    groupType: "",
  });

  const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        if (
            !formData.country ||
            !formData.travelStyle ||
            !formData.interest ||
            !formData.budget ||
            !formData.groupType 
        ) {
            setError('Please Provide values for all fields')
            setLoading(false)
            return
        }

        if (formData.duration < 1 || formData.duration > 10) {
            setError('Duration must be between 1 and 10 days')
            setLoading(false)
            return
      }
      
      try {
        const response = await fetch('/api/create-trip', {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            country: formData.country,
            duration: formData.duration,
            travelStyles: formData.travelStyle,
            interest: formData.interest,
            budget: formData.budget,
            groupType: formData.groupType

            
          })

          
        })
        const result: CreateTripResponse = await response.json()
        if (result?.id) navigate(`/trips/${result.id}`) 
        else console.error('Error generating trip',e)
      } catch (error) {
        
      }
  };

  const handleChange = (key: keyof TripFormData, value: string | Number) => {
    setFormData({ ...formData, [key]: value });
  };

  const countryData = countries.map((country) => ({
    text: country.name,
    value: country.value,
  }));

  const mapsData = [
    {
      country: formData.country,
      color: "#EA382E",
      coordinates:
        countries.find((c) => c.name === formData.country)?.coordinates || [],
    },
  ];
  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header
        title="Add a New Trip "
        description="View and Edit AI-generated Travel Plans"
      />

      <section className="mt-2.5 wrapper-md">
        <form className="trip-form " onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country</label>
            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ text: "text", value: "value" }}
              placeholder="Select a Country"
              className="combo-box"
              change={(e: { value: string | undefined }) => {
                if (e.value) {
                  handleChange("country", e.value);
                }
              }}
              allowFiltering={true}
              filtering={(e) => {
                const query = e.text.toLowerCase();
                e.updateData(
                  countries
                    .filter((country) =>
                      country.name.toLowerCase().includes(query)
                    )
                    .map((country) => ({
                      text: country.name,
                      value: country.value,
                    }))
                );
              }}
            />
          </div>
          <div>
            <label htmlFor="duration">Duration</label>
            <input
              type="number"
              name="duration"
              placeholder="Enter a number of days"
              className="form-input placeholder:text-gray-100"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>

          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>{formatKey(key)}</label>

              <ComboBoxComponent
                id={key}
                dataSource={comboBoxItems[key].map((item) => ({
                  text: item,
                  value: item,
                }))}
                placeholder={`Select ${formatKey(key)}`}
                change={(e: { value: string | undefined }) => {
                  if (e.value) {
                    handleChange(key, e.value);
                  }
                }}
                allowFiltering={true}
                filtering={(e) => {
                  const query = e.text.toLowerCase();
                  e.updateData(
                    comboBoxItems[key]
                      .filter((item) => item.toLowerCase().includes(query))
                      .map((item) => ({
                        text: item,
                        value: item,
                      }))
                  );
                }}
                className="combo-box"
              />
            </div>
          ))}

          <div>
            <label htmlFor="location">Location on world map</label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  shapeData={world_map}
                  dataSource={mapsData}
                  shapeDataPath="country"
                  shapePropertyPath="name"
                  shapeSettings={{ colorValuePath: "color", fill: "#e5e5e5" }}
                />
              </LayersDirective>
            </MapsComponent>
          </div>
          <div className="bg-gray-200 h-px w-full" />

          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          <footer className="px-6 w-full">
            <ButtonComponent
              type="submit"
              className="button-class !h-12 !w-full"
              disabled={loading}
            >
              <img
                src={`/assets/icons/${loading ? "loader.svg" : "magic-star.svg"}`}
                className={cn('size-5' , {'animate-spin' :loading})}
              />
              <span className="p-16-semibold text-white">
                {loading ? "Generating..." : "Generate Trip"}
              </span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default CreateTrip;
