@cars.each do |car|
    json.set! car.id do
        json.partial! '/api/cars/car', car: car
    end
end
