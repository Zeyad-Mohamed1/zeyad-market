import { ProductCard } from "@/components/layout/ProductCard";
import prisma from "@/lib/db";
import { type CategoryTypes } from "@prisma/client";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

async function getData(category: string) {
  let input;

  switch (category) {
    case "template": {
      input = "template";
      break;
    }
    case "uikit": {
      input = "uikit";
      break;
    }
    case "icon": {
      input = "icon";
      break;
    }
    case "all": {
      input = undefined;
      break;
    }
    default: {
      return notFound();
    }
  }

  const data = await prisma.product.findMany({
    where: {
      category: input as CategoryTypes,
    },
    select: {
      id: true,
      images: true,
      smallDescription: true,
      name: true,
      price: true,
    },
  });

  return data;
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  noStore();
  const data = await getData(params.category);
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-10 mt-4">
        {data.length > 0 ? (
          data.map((product) => (
            <ProductCard
              key={product.id}
              images={product.images}
              price={product.price}
              name={product.name}
              id={product.id}
              smallDescription={product.smallDescription}
            />
          ))
        ) : (
          <div className="col-span-3 text-center text-3xl py-10 bg-gray-300 font-bold text-red-500 w-full">
            No Products Found for {params.category}
          </div>
        )}
      </div>
    </section>
  );
}
