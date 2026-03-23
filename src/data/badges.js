// Per-chore thresholds
// v2 pacing — tier 10 is a 3+ year milestone
const CHORE_THRESHOLDS = {
  individual: [5, 15, 35, 60, 100, 150, 225, 325, 475, 650],
  collective: [10, 30, 65, 110, 180, 275, 400, 550, 800, 1100],
};

const OVERALL_THRESHOLDS = {
  individual: [25, 100, 250, 500, 900, 1500, 2500, 3750, 5000, 6500],
  collective: [50, 175, 450, 900, 1600, 2750, 4500, 6750, 9000, 12000],
};

// Badge ladders keyed by chore category
const BADGE_LADDERS = {
  pigs: {
    individual: [
      { name: 'Slop Starter', description: "You showed up with the bucket. That's the whole thing.", emoji: '\uD83E\uDEA3' },
      { name: 'Snout Whisperer', description: "They hear your footsteps and come running. That's trust.", emoji: '\uD83D\uDC37' },
      { name: 'Mud Boot Regular', description: "Your boots have a permanent layer. You've earned it.", emoji: '\uD83E\uDD7E' },
      { name: 'The Favorite Human', description: "Don't tell your partner, but the pigs like you best right now.", emoji: '\uD83D\uDC51' },
      { name: 'Oink Interpreter', description: 'You can tell the "I\'m hungry" squeal from the "I see you" squeal.', emoji: '\uD83D\uDDE3\uFE0F' },
      { name: 'Hundred-Bucket Hero', description: "One hundred trips to the pen. That's love with a handle on it.", emoji: '\uD83D\uDCAF' },
      { name: 'Pig Whisperer, First Class', description: "They don't just trust you. They expect you. That's family.", emoji: '\uD83C\uDFC5' },
      { name: 'Keeper of the Trough', description: "This isn't a chore anymore. It's a relationship.", emoji: '\uD83C\uDFC6' },
      { name: 'Patron Saint of Pigs', description: 'Somewhere a pig is telling other pigs about you.', emoji: '\u2B50' },
      { name: 'Legendary Swineherd', description: 'Five hundred feedings. You and these pigs have a story now.', emoji: '\uD83C\uDF1F' },
    ],
    collective: [
      { name: 'The Pig Team', description: "Together you've made sure no pig goes hungry. That's the deal.", emoji: '\uD83E\uDD1D' },
      { name: 'Double Bucket Brigade', description: 'Two people, one mission: happy pigs.', emoji: '\uD83E\uDEA3' },
      { name: 'Fifty Feedings Strong', description: 'Fifty times between you. The pigs are thriving and they know why.', emoji: '\uD83D\uDCAA' },
      { name: 'Our Pigs, Our Promise', description: 'You built a rhythm together. The pigs feel it.', emoji: '\uD83D\uDC91' },
      { name: 'Tag Team Trough Masters', description: "One of you always shows up. That's what partnership looks like.", emoji: '\uD83C\uDFF7\uFE0F' },
      { name: 'The Pig Partnership', description: "The pigs don't care who brings it. They care that it comes. And it always does.", emoji: '\uD83D\uDC95' },
      { name: 'Farmstead Guardians', description: 'Two hundred fifty feedings, shared between two hearts and four hands.', emoji: '\uD83D\uDEE1\uFE0F' },
      { name: 'Beloved of Pigs', description: 'If pigs wrote thank you notes, your fridge would be covered.', emoji: '\uD83D\uDC8C' },
      { name: 'The Unbroken Chain', description: 'Five hundred feedings between you. Not one missed.', emoji: '\uD83D\uDD17' },
      { name: 'Pig Paradise Builders', description: "You didn't just feed pigs. You gave them a life. Together.", emoji: '\uD83C\uDF08' },
    ],
  },
  chickens: {
    individual: [
      { name: 'Seed Scatter Rookie', description: 'First handful thrown. The chickens noticed.', emoji: '\uD83C\uDF3E' },
      { name: 'Cluck Whisperer', description: 'You\'ve learned the "food\'s here" cluck from the "where is everyone" cluck.', emoji: '\uD83D\uDC14' },
      { name: 'Early Bird Feeder', description: "Thirty rounds with the flock. They're starting to mob you with love.", emoji: '\uD83C\uDF05' },
      { name: 'The Hen Wrangler', description: 'Fifty feedings. You can scatter feed in your sleep now.', emoji: '\uD83E\uDD20' },
      { name: 'Chicken Charmer', description: 'The flock follows you around the yard. You are their person.', emoji: '\u2728' },
      { name: 'Centurion of the Coop', description: 'One hundred feedings. The chickens would elect you president.', emoji: '\uD83C\uDFDB\uFE0F' },
      { name: 'Feathered Friend, First Class', description: "They don't scatter when you come. They gather. That's everything.", emoji: '\uD83E\uDEB6' },
      { name: 'Grand Poultry Keeper', description: 'Two hundred trips to the coop. Your dedication is clucking impressive.', emoji: '\uD83C\uDF96\uFE0F' },
      { name: 'The Chicken Oracle', description: 'You can predict egg production by mood. Probably.', emoji: '\uD83D\uDD2E' },
      { name: 'Legendary Flock Guardian', description: 'Five hundred feedings. You and these birds have a whole saga.', emoji: '\uD83C\uDF1F' },
    ],
    collective: [
      { name: 'The Chicken Crew', description: 'Ten feedings together. The flock approves of this arrangement.', emoji: '\uD83E\uDD1D' },
      { name: 'Coop Co-Captains', description: "Twenty-five feedings shared. The chickens are living their best life.", emoji: '\uD83D\uDC6B' },
      { name: 'Fifty Scatters Strong', description: 'Half a hundred feedings between you. No chicken left behind.', emoji: '\uD83D\uDCAA' },
      { name: 'Our Flock, Our Joy', description: "You've built a chicken-feeding rhythm that works. They can tell.", emoji: '\uD83D\uDC91' },
      { name: 'The Egg Enablers', description: "Happy chickens lay happy eggs. You're both responsible for breakfast.", emoji: '\uD83E\uDD5A' },
      { name: 'Poultry Power Couple', description: 'One hundred seventy-five feedings, shared with love.', emoji: '\uD83D\uDC95' },
      { name: 'Guardians of the Coop', description: 'A quarter thousand feedings. The coop is a place of abundance.', emoji: '\uD83D\uDEE1\uFE0F' },
      { name: 'Flock Favorites', description: 'The chickens love you both. Possibly more than they love corn. Possibly.', emoji: '\uD83D\uDC8C' },
      { name: 'The Great Providers', description: "Five hundred feedings. That's a LOT of happy chickens.", emoji: '\uD83D\uDD17' },
      { name: 'Chicken Paradise Architects', description: 'You built a world where chickens thrive. Together.', emoji: '\uD83C\uDF08' },
    ],
  },
  dogs_feed: {
    individual: [
      { name: 'Kibble Rookie', description: 'Five bowls filled. Five tails wagged. Fair trade.', emoji: '\uD83E\uDD63' },
      { name: 'The Bowl Filler', description: 'They hear the scoop hit the bag from three rooms away.', emoji: '\uD83D\uDC15' },
      { name: 'Dinner Bell Hero', description: 'Thirty feedings. You ARE the dinner bell now.', emoji: '\uD83D\uDD14' },
      { name: 'Pack Provider', description: 'Fifty meals served. The pack knows who keeps them fed.', emoji: '\uD83D\uDC3E' },
      { name: 'The Good Human', description: "Seventy-five feedings. If dogs could write reviews, you'd be five stars.", emoji: '\u2B50' },
      { name: 'Centurion of Kibble', description: "One hundred bowls. You could do this blindfolded. (Don't.)", emoji: '\uD83D\uDCAF' },
      { name: 'Top Dog Feeder', description: 'The dogs would follow you anywhere. Especially toward the food bin.', emoji: '\uD83C\uDFC5' },
      { name: 'Grand Keeper of the Bowl', description: 'Two hundred feedings. This is devotion with a measuring cup.', emoji: '\uD83C\uDFC6' },
      { name: 'The Dog Whisperer', description: "Three hundred meals. They love you unconditionally. You've earned the conditional part too.", emoji: '\uD83C\uDF19' },
      { name: 'Legendary Pack Leader', description: 'Five hundred feedings. You are their person, full stop.', emoji: '\uD83C\uDF1F' },
    ],
    collective: [
      { name: 'The Feeding Team', description: "Ten bowls between you. The dogs don't care who \u2014 just that someone does.", emoji: '\uD83E\uDD1D' },
      { name: 'Bowl Brigade', description: 'Twenty-five shared feedings. Tails wag for you both.', emoji: '\uD83D\uDC6B' },
      { name: 'Fifty Scoops of Love', description: "Fifty feedings together. That's a lot of grateful puppy eyes.", emoji: '\uD83D\uDCAA' },
      { name: 'Our Pack, Our Family', description: "You keep the pack fed together. That's what family does.", emoji: '\uD83D\uDC91' },
      { name: 'The Reliability Duo', description: 'One hundred twenty-five feedings. The dogs never worry.', emoji: '\uD83E\uDD5A' },
      { name: 'Puppy Love Partners', description: 'One seventy-five meals, made with love, served by two.', emoji: '\uD83D\uDC95' },
      { name: 'Guardians of the Good Dogs', description: 'A quarter thousand bowls filled. The pack is thriving.', emoji: '\uD83D\uDEE1\uFE0F' },
      { name: 'Most Beloved Humans', description: "If dogs could pick their people, they'd pick you both. Again.", emoji: '\uD83D\uDC8C' },
      { name: 'The Faithful Feeders', description: "Five hundred meals between you. That's a whole year of never forgetting.", emoji: '\uD83D\uDD17' },
      { name: 'Legendary Pack Parents', description: 'Seven fifty feedings. You gave these dogs the good life. Together.', emoji: '\uD83C\uDF08' },
    ],
  },
  dogs_out: {
    individual: [
      { name: 'Door Opener', description: 'Five nights. Five openings. The dogs appreciate your service.', emoji: '\uD83D\uDEAA' },
      { name: 'Night Watch Beginner', description: "Fifteen nights of door duty. You're getting good at the cold.", emoji: '\uD83C\uDF19' },
      { name: 'Porch Light Regular', description: 'Thirty nights standing on the porch waiting. You know every star by now.', emoji: '\u2B50' },
      { name: 'The Reliable Door', description: "Fifty openings. The dogs trust the routine. They're at the door before you are.", emoji: '\uD83D\uDC15' },
      { name: 'Nighttime Guardian', description: "Seventy-five nights. Rain, snow, exhaustion \u2014 you still get up.", emoji: '\uD83C\uDF27\uFE0F' },
      { name: 'Centurion of the Back Door', description: 'One hundred nights. The hinges know your hand.', emoji: '\uD83D\uDCAF' },
      { name: 'Night Shepherd', description: 'You and the dark are old friends now.', emoji: '\uD83C\uDFC5' },
      { name: 'Keeper of the Evening Ritual', description: 'Two hundred nights. The dogs have never once had to ask twice.', emoji: '\uD83C\uDFC6' },
      { name: 'Moonlight Regular', description: 'Three hundred nights under the stars while the dogs do their thing.', emoji: '\uD83C\uDF15' },
      { name: 'Legendary Night Warden', description: 'Five hundred nights. The porch is your second office.', emoji: '\uD83C\uDF1F' },
    ],
    collective: [
      { name: 'The Night Shift Team', description: 'Ten nights between you. The dogs are covered.', emoji: '\uD83E\uDD1D' },
      { name: 'Door Duty Partners', description: "Twenty-five nights shared. Sometimes it's you, sometimes it's them. Always someone.", emoji: '\uD83D\uDC6B' },
      { name: 'Fifty Nights of Freedom', description: 'Fifty times the dogs got their evening run, thanks to teamwork.', emoji: '\uD83D\uDCAA' },
      { name: 'Our Evening Ritual', description: "You've made the nightly routine a shared thing. The dogs love that.", emoji: '\uD83D\uDC91' },
      { name: 'The Porch Partnership', description: 'One twenty-five nights. Your neighbors probably think you love stargazing.', emoji: '\uD83C\uDF03' },
      { name: 'Night Owls in Love', description: 'One seventy-five nights, keeping the dogs happy, keeping each other warm.', emoji: '\uD83D\uDC95' },
      { name: 'Guardians of the Goodnight', description: 'Two fifty nights together. The dogs sleep well because of you.', emoji: '\uD83D\uDEE1\uFE0F' },
      { name: 'Masters of the Evening', description: 'Three fifty nights. The routine runs itself, powered by partnership.', emoji: '\uD83D\uDC8C' },
      { name: 'The Endless Evening', description: 'Five hundred nights. A year and a half of never forgetting.', emoji: '\uD83D\uDD17' },
      { name: 'Legendary Night Watch', description: 'The dogs have never known a night without care. Because of you both.', emoji: '\uD83C\uDF08' },
    ],
  },
  kitty_litter: {
    individual: [
      { name: 'Scoop Soldier', description: "Five scoops. It's not glamorous, but it's honest work.", emoji: '\uD83E\uDE96' },
      { name: 'The Unsung Hero', description: 'Fifteen litter changes. Nobody claps for this. We do.', emoji: '\uD83E\uDEE1' },
      { name: 'Litter Box Lieutenant', description: "Thirty cleanings. You've mastered the art of breathing through your mouth.", emoji: '\uD83C\uDF96\uFE0F' },
      { name: "The Cat's Favorite", description: 'Fifty cleanings. The cats will never thank you, but they notice.', emoji: '\uD83D\uDC31' },
      { name: 'Scoopmaster General', description: "Seventy-five rounds. You could do this in the dark. (Please don't.)", emoji: '\u2694\uFE0F' },
      { name: 'Centurion of Clean Litter', description: 'One hundred scoops. This is the chore that builds character.', emoji: '\uD83D\uDCAF' },
      { name: 'The Quiet Servant', description: 'One fifty cleanings. No glory, no fanfare. Just clean boxes and happy cats.', emoji: '\uD83C\uDFC5' },
      { name: 'Grand Master of the Box', description: 'Two hundred. The cats purr louder on fresh litter nights and you know it.', emoji: '\uD83C\uDFC6' },
      { name: 'The Litter Legend', description: "Three hundred. If there were a litter box hall of fame, you'd be in it.", emoji: '\u2B50' },
      { name: 'Legendary Cat Servant', description: 'Five hundred cleanings. The cats own you. But they always did.', emoji: '\uD83C\uDF1F' },
    ],
    collective: [
      { name: 'The Scoop Squad', description: 'Ten scoops between you. Nobody does this alone.', emoji: '\uD83E\uDD1D' },
      { name: 'Litter Partners in Crime', description: 'Twenty-five shared scoops. Bonding over litter is still bonding.', emoji: '\uD83D\uDC6B' },
      { name: 'Fifty Scoops of Service', description: 'Fifty cleanings between you. The cats live in luxury.', emoji: '\uD83D\uDCAA' },
      { name: 'Our Cats, Our Cross to Bear', description: "Eighty-five scoops. You share the unglamorous stuff. That's real love.", emoji: '\uD83D\uDC91' },
      { name: 'The Fresh Litter Guarantee', description: 'One twenty-five scoops. Those cats have NEVER known a dirty box.', emoji: '\u2728' },
      { name: 'Partners in Poop', description: 'Look, someone had to say it. One seventy-five scoops of unglamorous love.', emoji: '\uD83D\uDC95' },
      { name: 'Guardians of Cat Comfort', description: "Two fifty scoops. The cats don't know how good they have it. You do.", emoji: '\uD83D\uDEE1\uFE0F' },
      { name: 'The Clean Machine', description: 'Three fifty scoops. Your system is flawless. The cats agree.', emoji: '\uD83D\uDC8C' },
      { name: 'The Tireless Duo', description: "Five hundred scoops between you. That's commitment.", emoji: '\uD83D\uDD17' },
      { name: 'Legendary Servants of Cats', description: 'Seven fifty scoops. The cats have won. And so have you.', emoji: '\uD83C\uDF08' },
    ],
  },
  waters: {
    individual: [
      { name: 'Water Bearer', description: 'Five refills. Every living thing on this farm thanks you.', emoji: '\uD83D\uDCA7' },
      { name: 'Stream Keeper', description: "Fifteen rounds of fresh water. You're the reason nothing goes thirsty.", emoji: '\uD83C\uDF0A' },
      { name: 'The Hydration Station', description: "Thirty water runs. You've carried gallons. Literal gallons.", emoji: '\uD83D\uDEB0' },
      { name: 'Well Keeper', description: 'Fifty refills. Clean water, every time. The most basic gift, the most important.', emoji: '\uD83E\uDEA3' },
      { name: 'The Spring', description: 'Seventy-five rounds. Water flows because of you.', emoji: '\u2653' },
      { name: 'Centurion of the Bowl', description: 'One hundred refills. Not a single animal has gone thirsty on your watch.', emoji: '\uD83D\uDCAF' },
      { name: 'Living Water', description: 'One fifty rounds. You carry what every creature needs most.', emoji: '\uD83C\uDFC5' },
      { name: 'Grand Water Bearer', description: 'Two hundred refills. The animals see you coming and they know: life is arriving.', emoji: '\uD83C\uDFC6' },
      { name: 'The Endless Well', description: 'Three hundred rounds. You never run dry.', emoji: '\u2B50' },
      { name: 'Legendary Source', description: 'Five hundred refills. You are the reason this farm stays alive.', emoji: '\uD83C\uDF1F' },
    ],
    collective: [
      { name: 'Water Team', description: "Ten refills between you. Nothing goes thirsty when you're both here.", emoji: '\uD83E\uDD1D' },
      { name: 'The Hydration Duo', description: 'Twenty-five shared rounds. You keep the water flowing together.', emoji: '\uD83D\uDC6B' },
      { name: 'Fifty Fills of Care', description: 'Fifty refills. Every bowl, every waterer, tended between you.', emoji: '\uD83D\uDCAA' },
      { name: 'Our Animals, Our Responsibility', description: 'Eighty-five rounds. You share the most essential chore there is.', emoji: '\uD83D\uDC91' },
      { name: 'The Never-Empty Bowl', description: 'One twenty-five refills. Together, you guarantee abundance.', emoji: '\uD83E\uDD63' },
      { name: 'Wellspring Partners', description: 'One seventy-five rounds. The water never stops because you never stop.', emoji: '\uD83D\uDC95' },
      { name: 'Guardians of the Water', description: 'A quarter thousand refills. The farm is hydrated and happy.', emoji: '\uD83D\uDEE1\uFE0F' },
      { name: 'The River That Feeds', description: 'Three fifty rounds. Your care is a current that never dries up.', emoji: '\uD83D\uDC8C' },
      { name: 'The Oasis Builders', description: 'Five hundred refills. You built a place where no one goes without.', emoji: '\uD83D\uDD17' },
      { name: 'Legendary Water Keepers', description: 'Seven fifty refills. Together, you are the source.', emoji: '\uD83C\uDF08' },
    ],
  },
  coffee: {
    individual: [
      { name: 'First Brew', description: 'Five pots prepped. Tomorrow morning just got easier.', emoji: '\u2615' },
      { name: 'Morning Maker', description: "Fifteen setups. You're the reason mornings don't hurt as much.", emoji: '\uD83C\uDF05' },
      { name: 'The Quiet Gift', description: 'Thirty preps. Making coffee for tomorrow is a love letter without words.', emoji: '\uD83D\uDC8C' },
      { name: 'Brewmaster', description: "Fifty setups. You've pre-made enough coffee to fill a swimming pool. Almost.", emoji: '\uD83C\uDFAF' },
      { name: "Dawn's Best Friend", description: 'Seventy-five preps. Morning you is so grateful to last-night you.', emoji: '\uD83C\uDF04' },
      { name: 'Centurion of Caffeine', description: 'One hundred setups. This is an act of love disguised as a chore.', emoji: '\uD83D\uDCAF' },
      { name: 'The Morning Whisperer', description: 'One fifty preps. You make mornings possible around here.', emoji: '\uD83C\uDFC5' },
      { name: 'Grand Coffee Architect', description: "Two hundred setups. You've engineered two hundred good mornings.", emoji: '\uD83C\uDFC6' },
      { name: 'Saint of the Coffee Pot', description: 'Three hundred preps. Canonization pending.', emoji: '\u2B50' },
      { name: 'Legendary Brew Guardian', description: 'Five hundred setups. Half a thousand mornings made better by you.', emoji: '\uD83C\uDF1F' },
    ],
    collective: [
      { name: 'The Coffee Couple', description: 'Ten preps between you. Neither of you will face a coffeeless morning.', emoji: '\uD83E\uDD1D' },
      { name: 'Brew Buddies', description: 'Twenty-five shared preps. You take turns making tomorrow better.', emoji: '\uD83D\uDC6B' },
      { name: 'Fifty Mornings Saved', description: "Fifty setups. That's fifty mornings neither of you had to suffer.", emoji: '\uD83D\uDCAA' },
      { name: 'Our Morning Ritual', description: 'Eighty-five preps. Coffee is love, and you both speak it fluently.', emoji: '\uD83D\uDC91' },
      { name: 'The Reliable Roast', description: 'One twenty-five preps. The coffee is ALWAYS ready. Always.', emoji: '\u2615' },
      { name: 'Caffeine Soulmates', description: 'One seventy-five preps. You love each other. And coffee. In that order. Probably.', emoji: '\uD83D\uDC95' },
      { name: 'Guardians of the Morning', description: 'Two fifty preps. Mornings are sacred. You protect them.', emoji: '\uD83D\uDEE1\uFE0F' },
      { name: "Masters of Tomorrow's Brew", description: "Three fifty preps. You've turned a chore into a tradition.", emoji: '\uD83D\uDC8C' },
      { name: 'The Eternal Pot', description: 'Five hundred preps. A year and a half of guaranteed good mornings.', emoji: '\uD83D\uDD17' },
      { name: 'Legendary Morning Makers', description: 'Seven fifty preps. You built a life where mornings start with warmth. Always.', emoji: '\uD83C\uDF08' },
    ],
  },
  overall: {
    individual: [
      { name: 'Homesteader', description: "Twenty-five chores done. You're building something real.", emoji: '\uD83C\uDFE0' },
      { name: 'Cornerstone', description: "Seventy-five chores. You're the kind of person who shows up. Every day.", emoji: '\uD83E\uDDF1' },
      { name: 'Farm Strong', description: 'One hundred fifty chores. Your hands know this work. Your heart does too.', emoji: '\uD83D\uDCAA' },
      { name: 'Steward of the Land', description: 'Two fifty chores. The animals are fed, the home is tended, the life is built.', emoji: '\uD83C\uDF3F' },
      { name: 'Keeper of the Hearth', description: 'Four hundred chores. You keep the fire burning. Literally and otherwise.', emoji: '\uD83D\uDD25' },
      { name: 'Heart of the Farm', description: 'Six hundred chores. This place runs because of you.', emoji: '\u2764\uFE0F' },
      { name: 'Pillar of the Home', description: "Eight fifty chores. You've poured yourself into this place and it shows.", emoji: '\uD83C\uDFDB\uFE0F' },
      { name: 'Force of Nature', description: 'Twelve hundred chores. Unstoppable. Unshakeable. Undeniably committed.', emoji: '\uD83C\uDF2A\uFE0F' },
      { name: 'Living Legend', description: 'Seventeen fifty chores. The farm, the animals, the home \u2014 they all bear your fingerprints.', emoji: '\u2B50' },
      { name: 'Master of the Homestead', description: "Twenty-five hundred chores. This isn't a task list anymore. This is a life, fully lived.", emoji: '\uD83C\uDF1F' },
    ],
    collective: [
      { name: 'Partners in Everything', description: 'Fifty chores between you. This is what building a life looks like.', emoji: '\uD83E\uDD1D' },
      { name: 'The Foundation', description: "One twenty-five chores. You're laying the groundwork for something lasting.", emoji: '\uD83E\uDDF1' },
      { name: 'Stronger Together', description: "Two fifty chores. Neither of you does this alone. That's the whole point.", emoji: '\uD83D\uDCAA' },
      { name: 'Our Home, Our Work', description: 'Four fifty chores. The house is standing because four hands hold it up.', emoji: '\uD83D\uDC91' },
      { name: 'The Daily Promise', description: 'Seven hundred chores. Every single one is a kept promise to each other.', emoji: '\uD83D\uDC8D' },
      { name: 'The Thousand Kindnesses', description: 'One thousand chores between you. A thousand small acts of love.', emoji: '\uD83D\uDC95' },
      { name: 'Unshakeable', description: 'Fifteen hundred chores. Whatever comes, you face it together. Clearly.', emoji: '\uD83D\uDEE1\uFE0F' },
      { name: 'The Great Partnership', description: 'Two thousand chores. This is what sixteen-plus years of love looks like in action.', emoji: '\uD83D\uDC8C' },
      { name: 'Legends of the Homestead', description: 'Three thousand chores. Your animals are happy. Your home is warm. Your love is in the work.', emoji: '\uD83D\uDD17' },
      { name: 'Eternal Stewards', description: "Forty-five hundred chores. You didn't just build a farm. You built a life. Together. Every day.", emoji: '\uD83C\uDF08' },
    ],
  },
  default: {
    individual: [
      { name: 'Getting Started', description: "Five times in. You've got this.", emoji: '\uD83D\uDE80' },
      { name: 'Building a Habit', description: "Fifteen and counting. It's becoming second nature.", emoji: '\uD83D\uDCAA' },
      { name: 'The Regular', description: 'Thirty completions. This is just what you do now.', emoji: '\u2B50' },
      { name: 'Dedicated', description: "Fifty times. That's real commitment.", emoji: '\uD83C\uDFAF' },
      { name: 'Rockstar', description: "Seventy-five. You're crushing it.", emoji: '\uD83C\uDFB8' },
      { name: 'The Hundred Club', description: 'One hundred completions. Welcome to the club.', emoji: '\uD83D\uDCAF' },
      { name: 'Unstoppable', description: 'One fifty. Nothing slows you down.', emoji: '\uD83C\uDFC5' },
      { name: 'Champion', description: "Two hundred. You've made this an art form.", emoji: '\uD83C\uDFC6' },
      { name: 'Master', description: 'Three hundred. Absolute mastery.', emoji: '\u2B50' },
      { name: 'Legend', description: 'Five hundred. Enough said.', emoji: '\uD83C\uDF1F' },
    ],
    collective: [
      { name: 'Team Effort', description: "Ten between you. That's how it starts.", emoji: '\uD83E\uDD1D' },
      { name: 'In This Together', description: 'Twenty-five shared completions. Teamwork.', emoji: '\uD83D\uDC6B' },
      { name: 'Fifty-Fifty', description: "Fifty times, shared. You've got each other.", emoji: '\uD83D\uDCAA' },
      { name: 'Dynamic Duo', description: 'Eighty-five together. A real partnership.', emoji: '\uD83D\uDC91' },
      { name: 'The Reliable Pair', description: 'One twenty-five. You always come through.', emoji: '\u2728' },
      { name: 'Power Couple', description: 'One seventy-five. Nobody does it better. Together.', emoji: '\uD83D\uDC95' },
      { name: 'Quarter-Thousand', description: "Two fifty. That's a lot of love in action.", emoji: '\uD83D\uDEE1\uFE0F' },
      { name: 'Unstoppable Together', description: 'Three fifty. Nothing gets in your way.', emoji: '\uD83D\uDC8C' },
      { name: 'The Gold Standard', description: 'Five hundred. This is what showing up looks like.', emoji: '\uD83D\uDD17' },
      { name: 'Legendary Team', description: 'Seven fifty. You built this together. Every single time.', emoji: '\uD83C\uDF08' },
    ],
  },
};

// Map chore names to badge categories
const CHORE_NAME_TO_CATEGORY = {
  pigs: 'pigs',
  pig: 'pigs',
  chicken: 'chickens',
  chickens: 'chickens',
  dog: 'dogs_feed',
  dogs: 'dogs_feed',
  'dogs out': 'dogs_out',
  'letting the dogs out': 'dogs_out',
  'kitty litter': 'kitty_litter',
  'kitty': 'kitty_litter',
  'litter': 'kitty_litter',
  'waters': 'waters',
  'water': 'waters',
  'coffee': 'coffee',
};

export function getBadgeCategory(choreName) {
  const lower = (choreName || '').toLowerCase();
  for (const [keyword, category] of Object.entries(CHORE_NAME_TO_CATEGORY)) {
    if (lower.includes(keyword)) return category;
  }
  return 'default';
}

export function getBadgeLadder(category, scope) {
  const ladder = BADGE_LADDERS[category] || BADGE_LADDERS.default;
  return ladder[scope] || ladder.individual;
}

export function getThresholds(category, scope) {
  if (category === 'overall') {
    return OVERALL_THRESHOLDS[scope] || OVERALL_THRESHOLDS.individual;
  }
  return CHORE_THRESHOLDS[scope] || CHORE_THRESHOLDS.individual;
}

export function computeBadgeProgress(count, category, scope) {
  const thresholds = getThresholds(category, scope);
  const ladder = getBadgeLadder(category, scope);

  let currentTier = 0;
  const earned = [];

  for (let i = 0; i < thresholds.length; i++) {
    if (count >= thresholds[i]) {
      currentTier = i + 1;
      earned.push({ tier: i + 1, ...ladder[i], threshold: thresholds[i] });
    }
  }

  const nextThreshold = currentTier < thresholds.length ? thresholds[currentTier] : null;
  const prevThreshold = currentTier > 0 ? thresholds[currentTier - 1] : 0;
  const percentToNext = nextThreshold
    ? Math.round(((count - prevThreshold) / (nextThreshold - prevThreshold)) * 100)
    : 100;

  return {
    currentCount: count,
    currentTier,
    earned,
    nextBadge: currentTier < ladder.length ? { tier: currentTier + 1, ...ladder[currentTier], threshold: nextThreshold } : null,
    percentToNext: Math.min(percentToNext, 100),
  };
}
