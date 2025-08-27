// // FUTURE:  add character sheets
import Image from "next/image";
import { Character } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@cfg/components/blocks/Card";

// TODO: add all character fields
export default function CharacterView({ character }: { character: Character }) {
  return (
    <div className="flex flex-col items-center gap-4">
        <div className="flex flex-row gap-4 items-center">
          <h1>{character.title}</h1>
        </div>
        <div className="flex flex-row gap-4 items-center">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    {character.portrait_url && <Image width={256} height={256} src={character.portrait_url} alt={character?.name ?? "Character Portrait"} />}
                </div>
                <div className="flex flex-col gap-4">
                    {character.token_url && <Image width = {128} height={128} src={character.token_url} alt={character?.name ?? "Character Token"} />}
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <Card>
                    <CardHeader>Character Name</CardHeader>
                    <CardContent>{character.name}</CardContent>
                </Card>
                <Card>
                    <CardHeader>Character Summary</CardHeader>
                    <CardContent>
                        <p>{character.summary}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>Character Description</CardHeader>
                    <CardContent>
                        <p>{character.description}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
