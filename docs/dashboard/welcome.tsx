import { useEffect, useRef, useState } from "react";
import {
  Button,
  FormControl,
  Input,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FormInput } from "@/components/formElements";

export function Welcome({ user }: { user: any }) {
  const { register, handleSubmit, reset, control, setValue } = useForm({
    defaultValues: {
      name: user?.name,
      pronouns: "they/them",
      gameSystems: [],
      gameSettings: [],
      story: {
        lines: [],
        veils: [],
        preferred: [],
      }
    },
  });
  const [step, setStep] = useState(1);
  const lastStep = 10;

  const doPrevious = () => setStep(step - 1);
  const doNext = () => setStep(step + 1);
  const doNextEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      doNext();
    }
  };
  const doFinish = () => {
    // cfg.onboarded = true;
    // update();
  };

  let bs = 1;
  return (
    <div className="flex flex-col items-center sm:container sm:mx-auto">
      <h1>Welcome to Crit-Fumble Gaming!</h1>
      <form>
        <div className={step !== bs++ ? "hidden" : ""}>
          <h3>Code of Conduct</h3>
          <p>
            The below code of conduct applies to all Crit-Fumble Gaming
            platforms, including World Anvil, Discord, and in-game sessions. By
            continuing, you agree to the following:
          </p>
          <List>
            <ListItem>
              <p>
                Be kind, courteous & respectful towards each other. If someone
                requests that the topic be changed, kindly do so. Hate speech in
                all it&apos;s forms and &quot;-isms&quot; are strictly
                forbidden. This is a safe space for persons of{" "}
                <b>
                  all backgrounds, ethnicities, sexual orientations, genders,
                  religions, and nationalities
                </b>
                .
              </p>
            </ListItem>
            <ListItem>
              <p>
                No Minors, **our games are 18+**. If you want to let your family
                sit in on your sessions, however, we try to keep things mostly
                PG-13. Nudity, gore, or other &quot;intense&quot; material is
                not permitted. Moderate swearing, light adult humor, and the
                occasional innuendo is allowed as long as your entire group has
                explicitly consented to such banter. Your GM will help you
                establish your boundaries firmly during &quot;Session
                Zero&quot;.
              </p>
            </ListItem>
            <ListItem>
              <p>
                Leaking of any personal information is not permissible and
                sharing of personal information is inadvisable. **Breaking this
                rule will result in a permanent ban**.
              </p>
            </ListItem>
            <ListItem>
              <p>
                Keep usernames appropriate--they must still follow all other
                rules of the server. If you want to use a character&apos;s name,
                we ask that you update your username as: &quot;Username
                [Character1/Character2/..]&quot; i.e Mumbley
                [Kade/Oda/Ralph/Whisper]. Include as many character names as you
                wish, but keep your username in the front so we can address you
                out-of-character. This will be the name we use to address you
                directly during sessions.
              </p>
            </ListItem>
            <ListItem>
              <p>
                Do not share, mention, or encourage pirated resources of any
                kind. You agree that you own the rights to any content you use
                in our games, or access from any of our hosted tools or bots.
              </p>
            </ListItem>
            <ListItem>
              <p>
                Have Fun! We are not aiming to build a collection of 100%
                lore-accurate campaign settings here, we are aiming to have a
                good time. During our sessions, we enjoy a lot of slapstick and
                irreverent parody humor, as well as serious storytelling and
                character development. We love a good combat encounter, too. If
                you want to play a different style of game, contact a @CFG aDMin
                on our Discord servr about creating your own campaign setting!
              </p>
            </ListItem>
          </List>
          <p>
            By continuing, you indicate that you agree to and understand the
            above.
          </p>
        </div>
        <div className={step !== bs++ ? "hidden" : ""}>
          <h3>Lines and Veils</h3>
          <p className="p-2">
            <b>Lines</b>: Lines are topics and themes which will be omitted from
            the game or conversation entirely.
          </p>
          <p>
            <b>Veils</b>: Veils are topics and themes which will be left
            &quot;off screen&quot;. That is, the events may take place, but they
            will not be described in detail. They will be alluded to, but not
            dwelled upon.
          </p>
          <p>
            By continuing, you indicate that you agree to and understand the
            above.
          </p>
        </div>
        <div className={step !== bs++ ? "hidden" : ""}>
          <p className="p-2">What should we call you?</p>
          <FormInput name="name" control={control} label="Name" />
        </div>
        <div className={step !== bs++ ? "hidden" : ""}>
          <p className="p-2">Which pronouns do you prefer?</p>
          {/* <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Pronouns</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              inputRef={pronounRef}
              defaultValue={"they/them"}
              label="Pronouns"
            >
              <MenuItem value={"they/them"}>They/Them</MenuItem>
              <MenuItem value={"she/her"}>She/Her</MenuItem>
              <MenuItem value={"he/him"}>He/Him</MenuItem>
              <MenuItem value={"other"}>Other (contact us)</MenuItem>
            </Select>
          </FormControl> */}
        </div>
        {/* <div className={step !== bs++ ? "hidden" : ""}>
          Welcome, {nameRef.current.value}! We&apos;re excited to have you join
          us. First, we need to know a bit about what sort of tabletop experience
          you&apos;re interested in. Let&apos;s get started!
        </div>
        <div className={(step !== bs++) ? 'hidden' : ''}>
          <p className="p-2">Which games are you interested in playing with us?</p>
          <FormControl fullWidth>
            <InputLabel>Game Systems</InputLabel>
            <Select
              multiple
              onChange={handleGameSystems}
            >
              <MenuItem value={'cypher2e'}>Cypher System 2nd Edition</MenuItem>
              <MenuItem value={'dnd5e'}>Dungeons & Dragons 5th Edition</MenuItem>
              <MenuItem value={'swade'}>Savage Worlds</MenuItem>
              <MenuItem value={'other'}>Other (contact us)</MenuItem>
            </Select>
          </FormControl>
        </div> */}
        {/* <div className={(step !== bs++) ? 'hidden' : ''}>
          <p className="p-2"></p>
          <FormControl fullWidth>
            <InputLabel>Game Settings</InputLabel>
            <Select
              multiple
              onChange={handleGameSettings}
              inputRef={gameSettingsRef}
            >
              <MenuItem value={'earth14'}>Earth CFG-XIV (Multiple Systems)</MenuItem>
              <MenuItem value={'afterworld'}>Afterworld (Cypher2e)</MenuItem>
              <MenuItem value={'khalbadian-space'}>Khalbadian Space (Multiple Systems)</MenuItem>
              <MenuItem value={'khalbadia-prime'}>Khalbadia Prime (D&D5e)</MenuItem>
              <MenuItem value={'ithlon'}>Empires of Ithlon (D&D5e)</MenuItem>
              <MenuItem value={'bitu'}>Mists of Bitu (D&D5e)</MenuItem>
              <MenuItem value={'toril22'}>Toril CFG-XXII (D&D5e)</MenuItem>
              <MenuItem value={'other'}>Other (contact us)</MenuItem>
            </Select>
          </FormControl>
        </div> */}
        <div className={step !== bs++ ? "hidden" : ""}>
          <p className="p-2"></p>
          <FormControl fullWidth>
            <InputLabel>Lines</InputLabel>
          </FormControl>
        </div>
        <div className={step !== bs++ ? "hidden" : ""}>
          <p className="p-2"></p>
          <FormControl fullWidth>
            <InputLabel>Veils</InputLabel>
          </FormControl>
        </div>
      </form>
      <div className="flex flex-row items-center">
        {step > 1 && (
          <Button style={{ minWidth: "32px" }} onClick={doPrevious}>
            ←
          </Button>
        )}
        {step < lastStep ? (
          <Button style={{ minWidth: "32px" }} onClick={doNext}>
            →
          </Button>
        ) : (
          <Button style={{ minWidth: "32px" }} onClick={doFinish}>
            🏁
          </Button>
        )}
      </div>
    </div>
  );
}
