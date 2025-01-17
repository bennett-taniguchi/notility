import { getServerSession } from "next-auth/next";
import { options as authOptions } from "../../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";
 

export default async function handle(req, res) {
 
  
 let para = "On a crisp autumn morning, Clara stepped onto the cobblestone streets of the bustling city, her mind racing with thoughts of the upcoming art exhibition, her hands clutching the carefully wrapped canvas that she hoped would capture the gallery curator’s attention, but as she passed the flower vendor arranging vibrant chrysanthemums into neat bouquets, she suddenly remembered the faint melody her grandmother used to hum while tending to her garden, a memory so vivid it almost drowned out the sounds of the city, which were a cacophony of honking horns, distant conversations, and the rhythmic clatter of horse-drawn carriages on the stones, though just as she was about to cross the street, a man juggling flaming torches in the square caught her eye, his movements so fluid and mesmerizing that she forgot where she was going for a moment, and then she noticed the smoke rising in the distance, a faint column against the clear blue sky, reminding her of the time she accidentally burned a batch of cookies while trying to impress her college roommate with a homemade recipe, but none of this stopped her from pressing forward to the gallery, where she hesitated on the doorstep, her doubts resurfacing, though they were soon drowned out by the loud caw of a crow perched on the wrought iron railing nearby, its beady eyes fixed on the crumpled paper bag an elderly man was clutching on a nearby bench, and Clara thought about how fleeting everything seemed in the moment—the art, the noise, the memories—and she almost didn’t notice the door to the gallery swinging open, beckoning her inside like a passage to a different world, one where she could finally be seen, though the smell of freshly baked bread wafting from a bakery down the street tugged at her senses again, grounding her in the strange, chaotic beauty of the present."
 
  res.json('result');
}
